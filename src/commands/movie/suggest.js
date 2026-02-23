const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const movieService = require('../../services/movieService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Suggest a movie')
        .addStringOption(option =>
            option.setName('movie')
                .setDescription('Movie title')
                .setRequired(true)
        ),

    async execute(interaction) {
        const title = interaction.options.getString('movie');
        const id = await movieService.createMovie(title);

        const button = new ButtonBuilder()
            .setCustomId(`vote_${id}`)
            .setLabel('Vote 🎬 (0)')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button);

        await interaction.reply({
            content: `🎥 **${title}**`,
            components: [row]
        });
    }
};