const pool = require('../database/db')
const { PermissionFlagsBits, ChannelType } = require('discord.js')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

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

    const result = await pool.query(`
        INSERT INTO fireside_participants (gathering_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        RETURNING *
    `, [gatheringId, userId])

    const wasInserted = result.rowCount > 0

    const { rows } = await pool.query(`
        SELECT COUNT(*)::int AS count
        FROM fireside_participants
        WHERE gathering_id = $1
    `, [gatheringId])

    return {
        count: rows[0].count,
        wasInserted
    }
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
        AND last_message_at < NOW() - INTERVAL '72 hours'
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

async function createSession(client, parentChannelId, userAId, userBId) {

    const guild = client.guilds.cache.first()

    const memberA = await guild.members.fetch(userAId).catch(() => null)
    const memberB = await guild.members.fetch(userBId).catch(() => null)

    if (!memberA || !memberB) {
        console.error('Could not fetch one or both members for fireside session.')
        return
    }

    const channel = await guild.channels.create({
        name: `fireside-${Date.now()}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
            {
                id: guild.id,
                deny: [PermissionFlagsBits.ViewChannel]
            },
            {
                id: memberA.id,
                allow: [PermissionFlagsBits.ViewChannel]
            },
            {
                id: memberB.id,
                allow: [PermissionFlagsBits.ViewChannel]
            }
        ]
    })

    await pool.query(`
        INSERT INTO fireside_sessions
            (channel_id, user_a, user_b)
        VALUES ($1, $2, $3)
    `, [channel.id, userAId, userBId])

    const button = new ButtonBuilder()
        .setCustomId('fireside_prompt')
        .setLabel('🌿 Ask a Gentle Question')
        .setStyle(ButtonStyle.Secondary)

    const row = new ActionRowBuilder().addComponents(button)

    await channel.send({
        content: "🔥 The fire has paired two guests.\n\nTake your time. This room will close after 72 hours of silence.",
        components: [row]
    })
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

    const { rows } = await pool.query(`
        SELECT *
        FROM fireside_gatherings
        WHERE status = 'active'
        AND ends_at <= NOW()
    `)

    for (const gathering of rows) {
        await closeActiveGathering(client)
    }
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