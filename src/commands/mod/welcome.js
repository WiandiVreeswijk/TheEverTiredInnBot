const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const requireRole = require('../../middleware/requireRole');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mod-welcome')
        .setDescription('Guidelines for welcoming new members'),

    async execute(interaction) {
        try {
            const allowed = await requireRole(
                "Innkeeper",
                "Inns' Assistant"
            )(interaction);

            if (!allowed) return;

            const embed = new EmbedBuilder()
                .setTitle('🌱 Welcoming New Members')
                .setColor(0x81c784)
                .setDescription(
                    '**Step-by-step welcome flow:**\n\n' +
                    '1️⃣ **Check profile & username**\n' +
                    '• If questionable, bring it to the mod team\n\n' +
                    '2️⃣ **Wait for introduction**\n' +
                    '• Give them space to introduce themselves\n\n' +
                    '3️⃣ **If everything aligns**\n' +
                    '• Assign the **Inn’s Resident** role\n\n' +
                    '4️⃣ **Welcome in #new-arrivals**\n' +
                    '• Ask a friendly question\n' +
                    '• Keep it warm and low-pressure'
                )
                .setFooter({ text: 'When in doubt, check in 💛' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            logger.error(error.stack || error);
            await interaction.reply({
                content: '❌ Failed to load welcome guidance.',
                ephemeral: true
            });
        }
    }
};

