const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stardew')
        .setDescription('How to join our Stardew Valley multiplayer server'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('🌱 Stardew Valley Multiplayer Server')
            .setColor(0x7cb342)
            .setDescription(
                '**Server Details**\n' +
                '🌐 **IP Address:** `51.81.179.55`\n' +
                '🔌 **Port:** `24642`\n\n' +
                '**📘 How to Join**\n' +
                'Not sure how to connect to a Stardew Valley server?\n' +
                'Follow this step-by-step guide:\n' +
                '👉 https://shockbyte.com/help/knowledgebase/articles/how-to-join-your-stardew-valley-server'
            )
            .setFooter({ text: 'Happy farming! 🌾' });

        await interaction.reply({ embeds: [embed] });
    }
};