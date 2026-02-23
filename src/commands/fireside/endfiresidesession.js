const { SlashCommandBuilder } = require('discord.js')
const pool = require('../../database/db')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('endfireside')
        .setDescription('Close this fireside conversation'),

    async execute(interaction) {

        const channelId = interaction.channel.id

        const { rows } = await pool.query(`
            SELECT *
            FROM fireside_sessions
            WHERE channel_id = $1
            AND status = 'active'
        `, [channelId])

        if (!rows.length) {
            return interaction.reply({
                content: "🔥 This is not an active fireside session.",
                ephemeral: true
            })
        }

        const session = rows[0]

        // Only allow participants to close it
        if (![session.user_a, session.user_b].includes(interaction.user.id)) {
            return interaction.reply({
                content: "🔥 Only participants may close this fireside.",
                ephemeral: true
            })
        }

        await interaction.reply("🔥 The fire is gently extinguished.")

        await pool.query(`
            UPDATE fireside_sessions
            SET status = 'closed'
            WHERE id = $1
        `, [session.id])

        setTimeout(async () => {
            await interaction.channel.delete().catch(() => {})
        }, 2000)
    }
}