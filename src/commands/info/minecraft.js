const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('minecraft')
        .setDescription('How to join The Ever-Tired Inn Minecraft server'),

    async execute(interaction) {
        try {
            const introEmbed = new EmbedBuilder()
                .setTitle('🎮 The Ever-Tired Inn — Minecraft Server')
                .setColor(0x57f287)
                .setDescription(
                    'This server runs on **Minecraft Bedrock Edition**.\n\n' +
                    '**You can join from:**\n' +
                    'Windows, Xbox, PlayStation, Switch, iOS, Android\n\n' +
                    'The server requires an invite before you can join. Please tag @illy in the #🪵minecraft-server or DM him with your username and you will be added to the server playerlist.'
                )
                .addFields(
                    { name: '🌐 IP', value: '`152.228.198.219`', inline: true },
                    { name: '🔌 Port', value: '`19132`', inline: true }
                )
                .setTimestamp();

            const guideEmbed = new EmbedBuilder()
                .setTitle('📘 How to Join')
                .setColor(0x3498db)
                .setDescription(
                    '1. Open Minecraft → **Play → Servers**\n' +
                    '2. Scroll down → **Add Server**\n' +
                    '3. Enter the IP & port above\n' +
                    '4. Save → Join\n\n' +
                    '📶 Make sure you are on Bedrock Edition.'
                )
                .setFooter({ text: 'Friendly survival environment 🧡' });

            await interaction.reply({
                embeds: [introEmbed, guideEmbed]
            });

        } catch (error) {
            logger.error(error.stack || error);
            await interaction.reply({
                content: '❌ Failed to load Minecraft server guide.',
                ephemeral: true
            });
        }
    }
};