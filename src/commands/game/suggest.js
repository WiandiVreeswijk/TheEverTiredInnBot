const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require('discord.js');

const retroGameService = require('../../services/gameService');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('SuggestGameOftheMonth')
        .setDescription('Suggest a game of the month')
        .addStringOption(option =>
            option.setName('game')
                .setDescription('Retro game title')
                .setRequired(true)
                .setMaxLength(100)
        ),

    async execute(interaction) {
        try {
            let title = interaction.options.getString('game');

            title = title.trim();

            if (!title) {
                return interaction.reply({
                    content: '❌ Game title cannot be empty.',
                    ephemeral: true
                });
            }

            const exists = await retroGameService.gameExists(title);

            if (exists) {
                return interaction.reply({
                    content: '⚠️ That retro game has already been suggested.',
                    ephemeral: true
                });
            }

            const id = await retroGameService.createGame(title);

            const button = new ButtonBuilder()
                .setCustomId(`vote_${id}`)
                .setLabel('Vote 🕹️ (0)')
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder().addComponents(button);

            const embed = new EmbedBuilder()
                .setTitle('🕹️ New Retro Game Suggestion')
                .setDescription(`**${title}**`)
                .setColor(0x5865F2)
                .setFooter({
                    text: `Suggested by ${interaction.user.username} • The Save Point`
                })
                .setTimestamp();

            await interaction.reply({
                embeds: [embed],
                components: [row]
            });

        } catch (error) {
            logger.error(error.stack || error);

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '❌ Failed to suggest retro game.',
                    ephemeral: true
                });
            }
        }
    }
};