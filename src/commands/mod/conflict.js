const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const requireRole = require('../../middleware/requireRole');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mod-conflict')
        .setDescription('How to handle disagreements between members'),

    async execute(interaction) {
        try {
            const allowed = await requireRole(
                "Innkeeper",
                "Inns' Assistant"
            )(interaction);

            if (!allowed) return;

            const embed = new EmbedBuilder()
                .setTitle('🧩 Handling Conflicts')
                .setColor(0xffcc80)
                .setDescription(
                    '**When members disagree:**\n\n' +
                    '1️⃣ **Pause before acting**\n' +
                    '• Check if rules are actually being broken\n' +
                    '• Not all conflict needs moderation\n\n' +
                    '2️⃣ **Listen to both sides**\n' +
                    '• Acknowledge feelings without assigning blame\n' +
                    '• Avoid taking sides publicly\n\n' +
                    '3️⃣ **De-escalate first**\n' +
                    '• Encourage a pause or private conversation\n' +
                    '• Suggest stepping away if emotions are high\n\n' +
                    '4️⃣ **Intervene only if needed**\n' +
                    '• Step in if harm, harassment, or rule violations occur\n' +
                    '• Keep responses calm, clear, and neutral'
                )
                .setFooter({ text: 'Safety & understanding over winning 💛' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            logger.error(error.stack || error);
            await interaction.reply({
                content: '❌ Failed to load conflict guidance.',
                ephemeral: true
            });
        }
    }
};
