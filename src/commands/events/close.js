const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const state = require('./state');

const ALLOWED_ROLES = ["Innkeeper", "Inns' Assistant"];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('event-close')
        .setDescription('Close voting and announce the chosen date'),

    async execute(interaction) {
        const allowed = interaction.member.roles.cache.some(r =>
            ALLOWED_ROLES.includes(r.name)
        );

        if (!allowed) {
            return interaction.reply({
                content: '⛔ Only Innkeepers and Inns\' Assistants can close events.',
                ephemeral: true
            });
        }

        if (!state.activeEvent || state.activeEvent.proposals.length === 0) {
            return interaction.reply({
                content: '❌ There is no active event with proposals.',
                ephemeral: true
            });
        }

        const sorted = [...state.activeEvent.proposals].sort(
            (a, b) => b.votes.length - a.votes.length
        );

        const topVotes = sorted[0].votes.length;
        const winners = sorted.filter(p => p.votes.length === topVotes);

        let description;

        if (topVotes === 0) {
            description = 'No votes were cast. Please coordinate manually 🌱';
        } else if (winners.length === 1) {
            description = `🏆 **Chosen date:**\n🗓️ **${winners[0].date} at ${winners[0].time}**\n\nWith **${topVotes} vote(s)**`;
        } else {
            const options = winners
                .map(w => `• ${w.date} at ${w.time}`)
                .join('\n');

            description =
                '🤝 **It’s a tie!**\n\n' +
                options +
                `\n\nEach with **${topVotes} vote(s)**`;
        }

        const embed = new EmbedBuilder()
            .setTitle(`📅 ${state.activeEvent.title}`)
            .setColor(0x81c784)
            .setDescription(description);

        state.activeEvent = null;

        await interaction.reply({ embeds: [embed] });
    }
};
