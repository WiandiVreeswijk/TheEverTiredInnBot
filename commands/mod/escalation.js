const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const ALLOWED_ROLES = ["Inns' Assistant", "Innkeeper"];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mod-escalation')
        .setDescription('When and how to escalate issues to the mod team'),

    async execute(interaction) {
        const hasRole = interaction.member.roles.cache.some(r => ALLOWED_ROLES.includes(r.name));
        if (!hasRole) {
            return interaction.reply({
                content: '⛔ This command is only available to the mod team.',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle('🚨 Escalation Guidelines')
            .setColor(0xe57373)
            .setDescription(
                '**Escalate to the full mod team when:**\n\n' +
                '• You feel unsure or uncomfortable making a decision\n' +
                '• A situation affects multiple members\n' +
                '• There’s repeated behavior or a pattern\n' +
                '• The issue involves sensitive topics or safety concerns\n\n' +
                '**How to escalate:**\n' +
                '• Share a short, factual summary in the mod channel\n' +
                '• Include context, not assumptions\n' +
                '• Allow space for others to weigh in before acting'
            )
            .setFooter({ text: 'Escalation is a strength, not a failure 💫' });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};


