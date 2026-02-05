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
                `**${interaction.user.username}** is looking for Steam friends!\n\n` +
                `🧾 **Friend Code:** \`${friendCode}\`\n\n` +
                '**How to add:**\n' +
                'Steam → Friends → Add a Friend → Enter a Friend Code'
            )
            .setFooter({ text: 'Click the button below to respond 👇' });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('steamfriend_reply')
                .setLabel('🤝 Add me on Steam')
                .setStyle(ButtonStyle.Primary)
        );

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
};
