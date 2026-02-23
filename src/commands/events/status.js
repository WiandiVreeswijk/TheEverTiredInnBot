const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const state = require('./state');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('event-status')
        .setDescription('View all proposed dates and current votes'),

    async execute(interaction) {
        if (!state.activeEvent) {
            return interaction.reply({
                content: '❌ There is no active event right now.',
                ephemeral: true
            });
        }

        if (state.activeEvent.proposals.length === 0) {
            return interaction.reply({
                content: '📭 No dates have been proposed yet.',
                ephemeral: true
            });
        }

        const lines = state.activeEvent.proposals.map(p =>
            `🗓️ **${p.date} at ${p.time}** — ${p.votes.length} vote(s)`
        );

        const embed = new EmbedBuilder()
            .setTitle(`📊 ${state.activeEvent.title}`)
            .setColor(0x64b5f6)
            .setDescription(lines.join('\n'))
            .setFooter({ text: 'Votes update live as people vote' });

        await interaction.reply({ embeds: [embed] });
    }
};

