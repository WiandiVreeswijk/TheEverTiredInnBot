const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const state = require('./state');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('event-propose')
        .setDescription('Propose a date and time for the active event')
        .addStringOption(option =>
            option
                .setName('date')
                .setDescription('Date (YYYY-MM-DD)')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('time')
                .setDescription('Time (HH:MM)')
                .setRequired(true)
        ),

    async execute(interaction) {
        if (!state.activeEvent) {
            return interaction.reply({
                content: '❌ There is no active event right now.',
                ephemeral: true
            });
        }

        const date = interaction.options.getString('date');
        const time = interaction.options.getString('time');

        const proposalId = Date.now().toString();

        const proposal = {
            id: proposalId,
            date,
            time,
            votes: []
        };

        state.activeEvent.proposals.push(proposal);

        const button = new ButtonBuilder()
            .setCustomId(`eventvote_${proposalId}`)
            .setLabel('Vote 🗳️ (0)')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button);

        await interaction.reply({
            content: `🗓️ **Proposed:** ${date} at ${time}`,
            components: [row]
        });
    }
};
