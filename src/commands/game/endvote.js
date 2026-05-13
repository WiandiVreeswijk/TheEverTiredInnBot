const {SlashCommandBuilder} = require('discord.js');
const pool = require('../../database/db');
const requireRole = require('../../middleware/requireRole');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('EndVoteGameOfTheMonth')
        .setDescription('End retro game voting and announce the winner'),

    async execute(interaction) {

        const allowed = await requireRole(
            'Innkeeper',
            'Inns’ Assistant'
        )(interaction);

        if (!allowed) return;

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const result = await client.query(`
                SELECT g.id, g.title, COUNT(v.user_id) ::int AS votes
                FROM retro_games g
                         LEFT JOIN retro_votes v ON g.id = v.game_id
                GROUP BY g.id
                ORDER BY votes DESC
            `);

            if (result.rows.length === 0) {
                await client.query('ROLLBACK');

                return interaction.reply(
                    '📭 No retro game suggestions.'
                );
            }

            const topVotes = result.rows[0].votes;

            if (topVotes === 0) {
                await client.query('ROLLBACK');

                return interaction.reply(
                    '😴 Nobody voted this month.'
                );
            }

            const winners = result.rows.filter(
                g => g.votes === topVotes
            );

            let message;

            if (winners.length === 1) {

                message =
                    `🏆 **Retro Game of the Month**

🕹️ **${winners[0].title}**
with ${topVotes} vote(s)!

Welcome to this month’s Save Point.`;

            } else {

                const tied = winners
                    .map(w => `🕹️ **${w.title}**`)
                    .join('\n');

                message =
                    `🤝 **It’s a tie!**

${tied}

Each game received ${topVotes} vote(s).`;
            }

            await client.query('DELETE FROM retro_votes');
            await client.query('DELETE FROM retro_games');

            await client.query('COMMIT');

            await interaction.reply(message);

        } catch (err) {

            await client.query('ROLLBACK');

            console.error(err);

            await interaction.reply({
                content: '❌ Something went wrong ending the retro game vote.',
                ephemeral: true
            });

        } finally {

            client.release();
        }
    }
};