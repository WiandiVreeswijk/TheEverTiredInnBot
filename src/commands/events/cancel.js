const { SlashCommandBuilder } = require('discord.js');
const state = require('./state');

const ALLOWED_ROLES = ["Innkeeper", "Inns' Assistant"];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('event-cancel')
        .setDescription('Cancel the current event'),

    async execute(interaction) {
        const allowed = interaction.member.roles.cache.some(r =>
            ALLOWED_ROLES.includes(r.name)
        );

        if (!allowed) {
            return interaction.reply({
                content: '⛔ Only Innkeepers and Inns\' Assistants can cancel events.',
                ephemeral: true
            });
        }

        if (!state.activeEvent) {
            return interaction.reply({
                content: '❌ There is no active event to cancel.',
                ephemeral: true
            });
        }

        state.activeEvent = null;

        await interaction.reply({
            content: '🛑 The current event has been cancelled.',
        });
    }
};
