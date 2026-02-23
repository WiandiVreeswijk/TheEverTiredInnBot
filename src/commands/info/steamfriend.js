const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('steamfriend')
        .setDescription('Share your Steam Friend Code')
        .addStringOption(option =>
            option
                .setName('code')
                .setDescription('Your Steam Friend Code (numbers only)')
                .setRequired(true)
                .setMaxLength(15)
        ),

    async execute(interaction) {
        try {
            const friendCode = interaction.options.getString('code').trim();

            if (!/^\d+$/.test(friendCode)) {
                return interaction.reply({
                    content: '❌ Friend code must contain numbers only.',
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setTitle('🎮 Steam Friend Code')
                .setColor(0x1b2838)
                .setDescription(
                    `**${interaction.user.username}** wants to connect on Steam!\n\n` +
                    `🧾 **Friend Code:** \`${friendCode}\`\n\n` +
                    'Click below to open Steam and add them 👇'
                )
                .setFooter({ text: 'Steam → Friends → Add a Friend' })
                .setTimestamp();

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel('➕ Add on Steam')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://steamcommunity.com/friends/add')
            );

            await interaction.reply({
                embeds: [embed],
                components: [row]
            });

        } catch (error) {
            logger.error(error.stack || error);
            await interaction.reply({
                content: '❌ Failed to share Steam friend code.',
                ephemeral: true
            });
        }
    }
};
