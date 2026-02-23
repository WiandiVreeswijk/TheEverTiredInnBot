const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require('discord.js');

const movieService = require('../../services/movieService');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Suggest a movie')
        .addStringOption(option =>
            option.setName('movie')
                .setDescription('Movie title')
                .setRequired(true)
                .setMaxLength(100)
        ),

    async execute(interaction) {
        try {
            let title = interaction.options.getString('movie');

            // 🧼 Basic sanitization
            title = title.trim();

            if (!title) {
                return interaction.reply({
                    content: '❌ Movie title cannot be empty.',
                    ephemeral: true
                });
            }

            // 🔎 Prevent duplicate suggestions
            const exists = await movieService.movieExists(title);
            if (exists) {
                return interaction.reply({
                    content: '⚠️ That movie has already been suggested.',
                    ephemeral: true
                });
            }

            const id = await movieService.createMovie(title);

            const button = new ButtonBuilder()
                .setCustomId(`vote_${id}`)
                .setLabel('Vote 🎬 (0)')
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder().addComponents(button);

            const embed = new EmbedBuilder()
                .setTitle('🎬 New Movie Suggestion')
                .setDescription(`**${title}**`)
                .setColor(0x57F287)
                .setFooter({ text: `Suggested by ${interaction.user.username}` })
                .setTimestamp();

            await interaction.reply({
                embeds: [embed],
                components: [row]
            });

        } catch (error) {
            logger.error(error.stack || error);

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '❌ Failed to suggest movie.',
                    ephemeral: true
                });
            }
        }
    }
};