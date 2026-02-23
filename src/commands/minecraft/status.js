const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const { getMinecraftStatus } = require('./getStatus');
const { buildMinecraftEmbed } = require('./buildEmbed');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('minecraft-status')
        .setDescription('Show the current status of the Minecraft Bedrock server'),

    async execute(interaction) {
        try {
            await interaction.deferReply();

            const data = await getMinecraftStatus();
            const embed = buildMinecraftEmbed(data);

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('minecraft_refresh')
                    .setLabel('🔄 Refresh')
                    .setStyle(ButtonStyle.Secondary)
            );

            await interaction.editReply({
                embeds: [embed],
                components: [row]
            });

        } catch (error) {
            logger.error(error.stack || error);

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '❌ Unable to fetch Minecraft server status.',
                    ephemeral: true
                });
            } else {
                await interaction.editReply({
                    content: '❌ Unable to fetch Minecraft server status.',
                    components: []
                });
            }
        }
    }
};
