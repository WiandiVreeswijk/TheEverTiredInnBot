const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const requireRole = require('../../middleware/requireRole');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mod-help')
        .setDescription('Overview of available moderator guidance commands'),

    async execute(interaction) {
        try {
            const allowed = await requireRole(
                "Innkeeper",
                "Inns' Assistant"
            )(interaction);

            if (!allowed) return;

            const embed = new EmbedBuilder()
                .setTitle('🛡️ Mod Help & Guidelines')
                .setColor(0xb39ddb)
                .setDescription(
                    'These commands are here to support you — not to enforce perfection.\n' +
                    'Use them whenever you’re unsure, overwhelmed, or just want a refresher 💛'
                )
                .addFields(
                    {
                        name: '🌱 Member Onboarding',
                        value:
                            '`/mod-welcome` — How to welcome new members\n' +
                            '`/mod-ticket` — How to handle tickets'
                    },
                    {
                        name: '🧩 Conflict & Decisions',
                        value:
                            '`/mod-conflict` — Handling disagreements\n' +
                            '`/mod-escalation` — When to involve the team'
                    },
                    {
                        name: '💬 Communication',
                        value: '`/mod-tone` — Clear & compassionate tone'
                    },
                    {
                        name: '🌿 Well-being',
                        value: '`/mod-burnout` — Recognizing burnout'
                    }
                )
                .setFooter({ text: 'You’re not expected to do this alone 💫' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            logger.error(error.stack || error);
            await interaction.reply({
                content: '❌ Failed to load mod help.',
                ephemeral: true
            });
        }
    }
};
