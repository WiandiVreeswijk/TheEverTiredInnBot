const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('donate')
        .setDescription('Support The Ever-Tired Inn and help keep our servers running'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('💛 Support The Ever-Tired Inn')
            .setColor(0xf4b942)
            .setDescription(
                'The Ever-Tired Inn is kept running by the community.\n' +
                'If you’d like to help cover the monthly costs, any support is deeply appreciated 💖\n\n' +
                '**Monthly costs:**\n' +
                '🤖 **Discord bot:** $5 / month\n' +
                '🌱 **Stardew Valley server:** $18 / month\n' +
                '⛏️ **Minecraft server:** $14 / month\n\n' +
                'Every donation — big or small — helps keep the inn cozy and online.'
            )
            .addFields(
                {
                    name: '☕ Support us on Ko-fi',
                    value: 'https://ko-fi.com/theevertiredinn'
                }
            )
            .setFooter({
                text: 'Thank you for being part of our little corner of the internet 💫'
            });

        await interaction.reply({ embeds: [embed] });
    }
};