const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const movieService = require('../../services/movieService');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('Show movie suggestions'),

    async execute(interaction) {
        try {
            const movies = await movieService.getMovies();

            if (!movies || movies.length === 0) {
                return interaction.reply({
                    content: '📭 No movie suggestions yet.',
                    ephemeral: true
                });
            }

            const description = movies
                .map((m, i) => {
                    const voteCount = Number(m.votes) || 0;
                    return `${i + 1}. 🎬 **${m.title}** — ${voteCount} vote(s)`;
                })
                .join('\n');

            const embed = new EmbedBuilder()
                .setTitle('🎥 Movie Night Suggestions')
                .setDescription(description)
                .setColor(0x5865F2)
                .setFooter({ text: 'Vote using the buttons below each suggestion!' });

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            logger.error(error.stack || error);

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '❌ Failed to fetch movie suggestions.',
                    ephemeral: true
                });
            }
        }
    }
};