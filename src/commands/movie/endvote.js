const { SlashCommandBuilder } = require('discord.js');
const pool = require('../../database/db');
const requireRole = require('../../middleware/requireRole');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('MovieNight_Endvote')
        .setDescription('End voting and announce the winner'),

    async execute(interaction) {

        // 🔐 Permission check
        const allowed = await requireRole(
            "Innkeeper",
            "Inns' Assistant"
        )(interaction);

        if (!allowed) return;

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const result = await client.query(`
                SELECT m.id, m.title, COUNT(v.user_id)::int AS votes
                FROM movies m
                LEFT JOIN votes v ON m.id = v.movie_id
                GROUP BY m.id
                ORDER BY votes DESC
            `);

            if (result.rows.length === 0) {
                await client.query('ROLLBACK');
                return interaction.reply('📭 No movie suggestions.');
            }

            const topVotes = result.rows[0].votes;

            if (topVotes === 0) {
                await client.query('ROLLBACK');
                return interaction.reply('😅 No one voted. Movie night cancelled!');
            }

            const winners = result.rows.filter(m => m.votes === topVotes);

            let message;

            if (winners.length === 1) {
                message = `🏆 Winner: 🎬 **${winners[0].title}** (${topVotes} votes)`;
            } else {
                const tied = winners.map(w => `🎬 **${w.title}**`).join(', ');
                message = `🤝 It’s a tie (${topVotes} votes each):\n${tied}`;
            }

            // Clear data safely
            await client.query('DELETE FROM votes');
            await client.query('DELETE FROM movies');

            await client.query('COMMIT');

            await interaction.reply(message);

        } catch (err) {
            await client.query('ROLLBACK');
            console.error(err);
            await interaction.reply({
                content: '❌ Something went wrong ending the vote.',
                ephemeral: true
            });
        } finally {
            client.release();
        }
    }
};