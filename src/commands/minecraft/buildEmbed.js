const { EmbedBuilder } = require('discord.js');

function buildMinecraftEmbed(data) {
    const embed = new EmbedBuilder()
        .setTitle('⛏️ Minecraft Server Status')
        .setTimestamp()
        .setFooter({ text: 'Bedrock Edition • The Ever-Tired Inn' });

    if (!data || !data.online) {
        return embed
            .setColor(0xe57373)
            .setDescription('🔴 The server is currently offline.');
    }

    const online = Number(data?.players?.online) || 0;
    const max = Number(data?.players?.max) || 0;

    return embed
        .setColor(0x4caf50)
        .addFields(
            {
                name: 'Status',
                value: '🟢 Online',
                inline: true
            },
            {
                name: 'Players',
                value: `👥 ${online} / ${max}`,
                inline: true
            }
        );
}

module.exports = { buildMinecraftEmbed };
