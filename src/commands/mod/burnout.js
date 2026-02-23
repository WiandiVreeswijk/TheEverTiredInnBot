const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const requireRole = require('../../middleware/requireRole');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mod-burnout')
        .setDescription('Recognizing burnout and knowing when to step back'),

    async execute(interaction) {
        try {
            const allowed = await requireRole(
                "Innkeeper",
                "Inns' Assistant"
            )(interaction);

            if (!allowed) return;

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
                .setFooter({ text: 'You matter more than the queue 💚' })
                .setTimestamp();

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });

        } catch (error) {
            logger.error(error.stack || error);

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '❌ Failed to load burnout guidance.',
                    ephemeral: true
                });
            }
        }
    }
};


