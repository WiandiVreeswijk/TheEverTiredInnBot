const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const { getMinecraftStatus } = require('./getStatus');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('minecraft-status')
        .setDescription('Show the current status of the Minecraft server'),

    async execute(interaction) {
        const data = await getMinecraftStatus();

        const embed = buildEmbed(data);
        const row = buildRow();

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
};

function buildEmbed(data) {
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

function buildRow() {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('minecraft_refresh')
            .setLabel('🔄 Refresh')
            .setStyle(ButtonStyle.Secondary)
    );
}
