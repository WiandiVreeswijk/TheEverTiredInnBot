const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const ALLOWED_ROLES = ["Inns' Assistant", "Innkeeper"];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mod-tone')
        .setDescription('Guidelines for clear and compassionate communication'),

    async execute(interaction) {
        const hasRole = interaction.member.roles.cache.some(r => ALLOWED_ROLES.includes(r.name));
        if (!hasRole) {
            return interaction.reply({
                content: '⛔ This command is only available to the mod team.',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle('💬 Mod Communication Tone')
            .setColor(0x90caf9)
            .setDescription(
                '**When communicating as a moderator:**\n\n' +
                '• Be calm, respectful, and human\n' +
                '• Use clear language — avoid sarcasm or passive aggression\n' +
                '• Assume good intent unless proven otherwise\n\n' +
                '**Helpful phrasing:**\n' +
                '• “I want to check in about…”\n' +
                '• “Let’s pause for a moment…”\n' +
                '• “Here’s what we need going forward…”\n\n' +
                '**Avoid:**\n' +
                '• Talking down to members\n' +
                '• Public shaming\n' +
                '• Responding while emotionally charged'
            )
            .setFooter({ text: 'Clear ≠ harsh. Kind ≠ unclear.' });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};


