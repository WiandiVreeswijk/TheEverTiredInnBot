const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const ALLOWED_ROLES = ["Inns' Assistant", "Innkeeper"];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mod-help')
        .setDescription('Overview of available moderator guidance commands'),

    async execute(interaction) {
        const hasRole = interaction.member.roles.cache.some(r =>
            ALLOWED_ROLES.includes(r.name)
        );

        if (!hasRole) {
            return interaction.reply({
                content: '⛔ This command is only available to the mod team.',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle('🛡️ Mod Help & Guidelines')
            .setColor(0xb39ddb)
            .setDescription(
                'These commands are here to support you — not to enforce perfection.\n' +
                'Use them whenever you’re unsure, overwhelmed, or just want a quick refresher 💛'
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
                        '`/mod-escalation` — When to involve the whole team'
                },
                {
                    name: '💬 Communication',
                    value:
                        '`/mod-tone` — Communicating gently but clearly'
                },
                {
                    name: '🌿 Well-being',
                    value:
                        '`/mod-burnout` — Recognizing burnout and stepping back'
                }
            )
            .setFooter({
                text: 'You’re not expected to do this alone 💫'
            });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};

