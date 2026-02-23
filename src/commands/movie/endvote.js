const { SlashCommandBuilder } = require('discord.js');
const pool = require('../../database/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('endvote')
        .setDescription('End voting and announce the winner'),

    async execute(interaction) {

        const result = await pool.query(`
            SELECT m.id, m.title, COUNT(v.user_id) AS votes
            FROM movies m
            LEFT JOIN votes v ON m.id = v.movie_id
            GROUP BY m.id
            ORDER BY votes DESC
        `);

        if (result.rows.length === 0) {
            return interaction.reply('📭 No movie suggestions.');
        }

        const topVotes = result.rows[0].votes;

        if (topVotes == 0) {
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

        // Clear tables after vote
        await pool.query('DELETE FROM votes');
        await pool.query('DELETE FROM movies');

        await interaction.reply(message);
    }
};