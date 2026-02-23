const pool = require('../database/db')
const { PermissionFlagsBits, ChannelType } = require('discord.js')

async function getActiveGathering() {
    const { rows } = await pool.query(`
        SELECT * FROM fireside_gatherings
        WHERE status = 'active'
        LIMIT 1
    `)
    return rows[0] || null
}

async function createGathering(messageId, channelId, userId, durationMs) {
    const endsAt = new Date(Date.now() + durationMs)

    const { rows } = await pool.query(`
        INSERT INTO fireside_gatherings
        (message_id, channel_id, started_by, ends_at)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `, [messageId, channelId, userId, endsAt])

    await pool.query(`
        INSERT INTO fireside_participants (gathering_id, user_id)
        VALUES ($1, $2)
    `, [rows[0].id, userId])

    return rows[0]
}

async function joinGathering(gatheringId, userId) {
    await pool.query(`
        INSERT INTO fireside_participants (gathering_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
    `, [gatheringId, userId])

    const { rows } = await pool.query(`
        SELECT COUNT(*)::int AS count
        FROM fireside_participants
        WHERE gathering_id = $1
    `, [gatheringId])

    return rows[0].count
}

async function touchSession(channelId) {
    await pool.query(`
        UPDATE fireside_sessions
        SET last_message_at = NOW()
        WHERE channel_id = $1
          AND status = 'active'
    `, [channelId])
}

async function checkExpiredSessions(client) {
    const { rows } = await pool.query(`
        SELECT * FROM fireside_sessions
        WHERE status = 'active'
        AND last_message_at < NOW() - INTERVAL '24 hours'
    `);

    for (const session of rows) {
        const channel = await client.channels.fetch(session.channel_id).catch(() => null);

        if (channel) {
            await channel.send("🔥 The fire cools. Thank you for sharing warmth tonight.");
            await channel.delete().catch(() => {});
        }

        await pool.query(`
            UPDATE fireside_sessions
            SET status = 'closed'
            WHERE id = $1
        `, [session.id]);
    }
}

async function createSession(client, parentChannelId, userA, userB) {

    const guild = client.guilds.cache.first()

    const channel = await guild.channels.create({
        name: `fireside-${Date.now()}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
            {
                id: guild.id,
                deny: [PermissionFlagsBits.ViewChannel]
            },
            {
                id: userA,
                allow: [PermissionFlagsBits.ViewChannel]
            },
            {
                id: userB,
                allow: [PermissionFlagsBits.ViewChannel]
            }
        ]
    })

    await pool.query(`
        INSERT INTO fireside_sessions
            (channel_id, user_a, user_b)
        VALUES ($1, $2, $3)
    `, [channel.id, userA, userB])

    await channel.send(
        "🔥 The fire has paired two guests.\n\nTake your time. This room will close after 24 hours of silence."
    )
}

async function closeActiveGathering(client) {

    const gathering = await getActiveGathering()
    if (!gathering) return { error: 'No active gathering.' }

    const { rows } = await pool.query(`
        SELECT user_id
        FROM fireside_participants
        WHERE gathering_id = $1
    `, [gathering.id])

    const participants = rows.map(r => r.user_id)

    const channel = await client.channels.fetch(gathering.channel_id).catch(() => null)
    let message = null

    if (channel) {
        message = await channel.messages.fetch(gathering.message_id).catch(() => null)
    }

    const { EmbedBuilder } = require('discord.js')

    // ───── CASE 1: Not Enough Participants ─────
    if (participants.length < 2) {

        await pool.query(`
            UPDATE fireside_gatherings
            SET status = 'closed'
            WHERE id = $1
        `, [gathering.id])

        if (message) {
            const quietEmbed = EmbedBuilder.from(message.embeds[0])
                .setTitle("🔥 The Fire Burned Quietly")
                .setDescription(
                    "The fire burned softly tonight,\n" +
                    "but no pairings were formed.\n\n" +
                    "Perhaps another evening will bring more company."
                )

            await message.edit({
                embeds: [quietEmbed],
                components: []
            })
        }

        return { message: 'Gathering closed (no pairings).' }
    }

    // ───── CASE 2: Pair Participants ─────
    participants.sort(() => Math.random() - 0.5)

    while (participants.length >= 2) {
        const userA = participants.pop()
        const userB = participants.pop()
        await createSession(client, gathering.channel_id, userA, userB)
    }

    await pool.query(`
        UPDATE fireside_gatherings
        SET status = 'closed'
        WHERE id = $1
    `, [gathering.id])

    if (message) {
        const closedEmbed = EmbedBuilder.from(message.embeds[0])
            .setTitle("🔥 The Fire Has Dimmed")
            .setDescription(
                "Tonight’s gathering has ended.\n\n" +
                "Paired guests continue their conversations in quiet corners of the Inn."
            )

        await message.edit({
            embeds: [closedEmbed],
            components: []
        })
    }

    return { message: 'Gathering closed successfully.' }
}

async function checkExpiredGatherings(client) {
    // Not implemented yet
}

module.exports = {
    getActiveGathering,
    createGathering,
    joinGathering,
    touchSession,
    checkExpiredGatherings,
    checkExpiredSessions,
    closeActiveGathering
}