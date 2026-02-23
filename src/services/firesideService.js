const pool = require('../database/db')

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
    `, [channelId]);
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