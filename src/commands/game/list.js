const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const retroGameService = require('../../services/gameService');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gamelist')
        .setDescription('Show game suggestions'),

    async execute(interaction) {
        try {
            const games = await retroGameService.getGames();

            if (!games || games.length === 0) {
                return interaction.reply({
                    content: '📭 No game suggestions yet.',
                    ephemeral: true
                });
            }

            const description = games
                .map((g, i) => {
                    const voteCount = Number(g.votes) || 0;

                    return `${i + 1}. 🕹️ **${g.title}** — ${voteCount} vote(s)`;
                })
                .join('\n');

            const embed = new EmbedBuilder()
                .setTitle('🕹️ Checkpoint Café — Game Voting')
                .setDescription(description)
                .setColor(0x5865F2)
                .setFooter({
                    text: 'Vote using the buttons below each suggestion!'
                });

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            logger.error(error.stack || error);

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '❌ Failed to fetch game suggestions.',
                    ephemeral: true
                });
            }
        }
    }
};