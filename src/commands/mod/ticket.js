const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const ALLOWED_ROLES = ['Inns\' Assistant', 'Innkeeper'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mod-ticket')
        .setDescription('Guidelines for handling tickets'),

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
            .setTitle('🎫 Handling Tickets')
            .setColor(0xffd54f)
            .setDescription(
                '**Ticket handling guidelines:**\n\n' +
                '1️⃣ **You can reply on your own**\n' +
                '• You don’t need another mod’s approval\n\n' +
                '2️⃣ **If you’re unsure**\n' +
                '• Tag the ticket channel in the mod team channel\n\n' +
                '3️⃣ **After a solution is chosen**\n' +
                '• Ask if the solution works for them\n\n' +
                '4️⃣ **Closing the ticket**\n' +
                '• Close after confirmation\n' +
                '• Or after **48 hours** without a response'
            )
            .setFooter({ text: 'Clear, kind, and consistent 💫' });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
