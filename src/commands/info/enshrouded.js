const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('enshrouded')
        .setDescription('How to join The Ever-Tired Inn Enshrouded server'),

    async execute(interaction) {
        try {
            const introEmbed = new EmbedBuilder()
                .setTitle('⚔️ The Ever-Tired Inn — Enshrouded Server')
                .setColor(0x57f287)
                .setDescription(
                    'Join our shared world in **Enshrouded** and adventure together through the Shroud.\n\n' +
                    '**Before joining:**\n' +
                    '• Make sure your game is updated to the latest version.\n' +
                    '• Ensure you are connected to the same network or VPN if required.\n' +
                    '• If you have trouble connecting, ask in the server for help.'
                )
                .addFields(
                    { name: '🌐 Server IP', value: '`192.168.0.50`', inline: true },
                    { name: '🔌 Port', value: '`15637`', inline: true }
                )
                .setTimestamp();

            const guideEmbed = new EmbedBuilder()
                .setTitle('📘 How to Join')
                .setColor(0x3498db)
                .setDescription(
                    '1. Launch **Enshrouded**\n' +
                    '2. Select **Play → Join Game**\n' +
                    '3. Open the **Direct Connect** menu\n' +
                    '4. Enter the IP address and port shown above\n' +
                    '5. Connect and begin your adventure\n\n' +
                    '🔥 Build, explore, and survive together!'
                )
                .setFooter({ text: 'Adventure awaits in Embervale ⚔️' });

            await interaction.reply({
                embeds: [introEmbed, guideEmbed]
            });

        } catch (error) {
            logger.error(error.stack || error);

            await interaction.reply({
                content: '❌ Failed to load Enshrouded server guide.',
                ephemeral: true
            });
        }
    }
};