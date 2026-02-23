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
                'Click the button below to open Steam and add them 👇'
            )
            .setFooter({ text: 'Steam → Friends → Add a Friend' });

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
    }
};
