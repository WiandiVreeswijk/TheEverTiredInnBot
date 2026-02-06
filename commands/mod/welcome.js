const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const ALLOWED_ROLES = ['Inns\' Assistant', 'Innkeeper'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mod-welcome')
        .setDescription('Guidelines for welcoming new members'),

    async execute(interaction) {
        const memberRoles = interaction.member.roles.cache;
        const isAllowed = ALLOWED_ROLES.some(role =>
            memberRoles.some(r => r.name === role)
        );

        if (!isAllowed) {
            return interaction.reply({
                content: '⛔ This command is only available to the mod team.',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle('🌱 Welcoming New Members')
            .setColor(0x81c784)
            .setDescription(
                '**Step-by-step welcome flow:**\n\n' +
                '1️⃣ **Check their profile & name**\n' +
                '• Review their profile description and username\n' +
                '• If anything feels questionable, flag it with the mod team\n\n' +
                '2️⃣ **Wait for an introduction**\n' +
                '• Give them space to introduce themselves\n\n' +
                '3️⃣ **If everything feels good**\n' +
                '• Assign the **Inn’s Resident** role\n\n' +
                '4️⃣ **Welcome them in #new-arrivals**\n' +
                '• Ask a friendly question\n' +
                '• Keep it warm and low-pressure'
            )
            .setFooter({ text: 'When in doubt, check in with the mod team 💛' });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};

