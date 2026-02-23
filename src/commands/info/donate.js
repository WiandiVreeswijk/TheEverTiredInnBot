const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('donate')
        .setDescription('Support The Ever-Tired Inn'),

    async execute(interaction) {
        try {
            const embed = new EmbedBuilder()
                .setTitle('💛 Support The Ever-Tired Inn')
                .setColor(0xf4b942)
                .setDescription(
                    'The Ever-Tired Inn is community-supported.\n' +
                    'If you’d like to help cover monthly costs, any support means the world 💖\n\n' +
                    '**Monthly Costs:**\n' +
                    '🤖 Discord bot — $5\n' +
                    '🌱 Stardew server — $24.43\n' +
                    '⛏️ Minecraft server — $14.50\n\n' +
                    'Every donation helps keep the inn cozy and online.'
                )
                .addFields({
                    name: '☕ Support us on Ko-fi',
                    value: 'https://ko-fi.com/theevertiredinn'
                })
                .setFooter({
                    text: 'Thank you for being part of our little corner 💫'
                })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            logger.error(error.stack || error);
            await interaction.reply({
                content: '❌ Failed to load donation information.',
                ephemeral: true
            });
        }
    }
};