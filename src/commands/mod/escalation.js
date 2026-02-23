const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const requireRole = require('../../middleware/requireRole');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mod-escalation')
        .setDescription('When and how to escalate issues to the mod team'),

    async execute(interaction) {
        try {
            const allowed = await requireRole(
                "Innkeeper",
                "Inns' Assistant"
            )(interaction);

            if (!allowed) return;

            const embed = new EmbedBuilder()
                .setTitle('🚨 Escalation Guidelines')
                .setColor(0xe57373)
                .setDescription(
                    '**Escalate when:**\n\n' +
                    '• You feel unsure or uncomfortable making a decision\n' +
                    '• A situation affects multiple members\n' +
                    '• There’s repeated behaviour or a pattern\n' +
                    '• Sensitive topics or safety concerns are involved\n\n' +
                    '**How to escalate:**\n' +
                    '• Share a short, factual summary in the mod channel\n' +
                    '• Include context, not assumptions\n' +
                    '• Allow space for discussion before acting'
                )
                .setFooter({ text: 'Escalation is strength, not failure 💫' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            logger.error(error.stack || error);
            await interaction.reply({
                content: '❌ Failed to load escalation guidance.',
                ephemeral: true
            });
        }
    }
};

