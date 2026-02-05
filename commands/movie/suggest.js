const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const state = require('./state');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Suggest a movie for movie night')
        .addStringOption(option =>
            option
                .setName('movie')
                .setDescription('Movie title')
                .setRequired(true)
        ),

    async execute(interaction) {
        if (!state.votingOpen) {
            return interaction.reply({
                content: '⛔ Voting has ended. No more suggestions allowed.',
                ephemeral: true
            });
        }

        const movie = interaction.options.getString('movie');

        const suggestion = {
            id: Date.now().toString(),
            title: movie,
            votes: []
        };

        state.suggestions.push(suggestion);

        const button = new ButtonBuilder()
            .setCustomId(`vote_${suggestion.id}`)
            .setLabel('Vote 🎬 (0)')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button);

        const message = await interaction.reply({
            content: `🎥 **${movie}**`,
            components: [row],
            fetchReply: true
        });

        suggestion.messageId = message.id;
    }
};