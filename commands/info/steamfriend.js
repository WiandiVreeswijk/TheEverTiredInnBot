const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('steamfriend')
        .setDescription('Share your Steam Friend Code so others can add you')
        .addStringOption(option =>
            option
                .setName('code')
                .setDescription('Your Steam Friend Code (numbers only)')
                .setRequired(true)
        ),

    async execute(interaction) {
        const friendCode = interaction.options.getString('code');

        const embed = new EmbedBuilder()
            .setTitle('🎮 Steam Friend Code')
            .setColor(0x1b2838)
            .setDescription(
                `**${interaction.user.username}** wants to connect on Steam!\n\n` +
                `🧾 **Friend Code:** \`${friendCode}\`\n\n` +
                'Use the buttons below to add them quickly 👇'
            )
            .setFooter({ text: 'Steam → Friends → Add a Friend' });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('➕ Add on Steam')
                .setStyle(ButtonStyle.Link)
                .setURL('https://steamcommunity.com/friends/add'),

            new ButtonBuilder()
                .setCustomId(`steamfriend_copy_${friendCode}`)
                .setLabel('📋 Copy Friend Code')
                .setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
};

