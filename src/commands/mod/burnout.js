const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const ALLOWED_ROLES = ["Inns' Assistant", "Innkeeper"];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mod-burnout')
        .setDescription('Recognizing burnout and knowing when to step back'),

    async execute(interaction) {
        const hasRole = interaction.member.roles.cache.some(r => ALLOWED_ROLES.includes(r.name));
        if (!hasRole) {
            return interaction.reply({
                content: '⛔ This command is only available to the mod team.',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle('🌿 Mod Burnout & Self-Care')
            .setColor(0xa5d6a7)
            .setDescription(
                '**It’s okay to step back when:**\n\n' +
                '• You feel emotionally drained or overwhelmed\n' +
                '• You’re reacting more strongly than usual\n' +
                '• Moderation starts to feel like a burden\n\n' +
                '**What to do:**\n' +
                '• Let the mod team know you need a break\n' +
                '• Step back temporarily — no explanations required\n' +
                '• Focus on your own well-being\n\n' +
                '**Remember:**\n' +
                'A healthy mod team requires healthy moderators.'
            )
            .setFooter({ text: 'You matter more than the queue 💚' });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};


