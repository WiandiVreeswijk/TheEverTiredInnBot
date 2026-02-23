const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const { getMinecraftStatus } = require('./getStatus');
const { buildMinecraftEmbed } = require('./buildEmbed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('minecraft-status')
        .setDescription('Show the current status of the Minecraft Bedrock server'),

    async execute(interaction) {
        try {
            const data = await getMinecraftStatus();

            const embed = buildMinecraftEmbed(data);
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('minecraft_refresh')
                    .setLabel('🔄 Refresh')
                    .setStyle(ButtonStyle.Secondary)
            );

            await interaction.reply({
                embeds: [embed],
                components: [row]
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: '❌ Unable to fetch the Minecraft server status.',
                ephemeral: true
            });
        }
    }
};
