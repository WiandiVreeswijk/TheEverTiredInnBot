const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const requireRole = require('../../middleware/requireRole');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mod-ticket')
        .setDescription('Guidelines for handling tickets'),

    async execute(interaction) {
        try {
            const allowed = await requireRole(
                "Innkeeper",
                "Inns' Assistant"
            )(interaction);

            if (!allowed) return;

            const embed = new EmbedBuilder()
                .setTitle('🎫 Handling Tickets')
                .setColor(0xffd54f)
                .setDescription(
                    '**Ticket guidelines:**\n\n' +
                    '1️⃣ You can reply independently\n\n' +
                    '2️⃣ If unsure → escalate in mod channel\n\n' +
                    '3️⃣ After solution → confirm with member\n\n' +
                    '4️⃣ Close after confirmation or 48h silence'
                )
                .setFooter({ text: 'Clear, kind, consistent 💫' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            logger.error(error.stack || error);
            await interaction.reply({
                content: '❌ Failed to load ticket guidance.',
                ephemeral: true
            });
        }
    }
};