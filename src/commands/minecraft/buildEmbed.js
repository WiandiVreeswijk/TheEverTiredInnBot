const { EmbedBuilder } = require('discord.js');

function buildMinecraftEmbed(data) {
    if (!data.online) {
        return new EmbedBuilder()
            .setTitle('⛏️ Minecraft Server Status')
            .setColor(0xe57373)
            .setDescription('🔴 The server is currently offline.');
    }

    return new EmbedBuilder()
        .setTitle('⛏️ Minecraft Server Status')
        .setColor(0x4caf50)
        .addFields(
            {
                name: 'Status',
                value: '🟢 Online',
                inline: true
            },
            {
                name: 'Players',
                value: `👥 ${data.players.online} / ${data.players.max}`,
                inline: true
            }
        )
        .setFooter({ text: 'Bedrock Edition' });
}

module.exports = { buildMinecraftEmbed };
