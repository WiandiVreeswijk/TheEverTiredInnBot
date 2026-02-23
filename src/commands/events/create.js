const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

const state = require('./state');

const ALLOWED_ROLES = ["Innkeeper", "Inns' Assistant"];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('event-create')
        .setDescription('Create a new event for scheduling')
        .addStringOption(option =>
            option
                .setName('title')
                .setDescription('Event title')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('description')
                .setDescription('What is this event about?')
                .setRequired(true)
        ),

    async execute(interaction) {
        const hasPermission = interaction.member.roles.cache.some(role =>
            ALLOWED_ROLES.includes(role.name)
        );

        if (!hasPermission) {
            return interaction.reply({
                content: '⛔ Only Innkeepers and Inns\' Assistants can create events.',
                ephemeral: true
            });
        }

        if (state.activeEvent) {
            return interaction.reply({
                content: '⚠️ There is already an active event. Please finish it before creating a new one.',
                ephemeral: true
            });
        }

        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');

        state.activeEvent = {
            title,
            description,
            proposals: []
        };

        const embed = new EmbedBuilder()
            .setTitle(`📅 ${title}`)
            .setColor(0x81c784)
            .setDescription(
                `${description}\n\n` +
                '🕒 **Propose dates & times using:**\n' +
                '`/event-propose date:YYYY-MM-DD time:HH:MM`\n\n' +
                'Once options are proposed, everyone can vote!'
            )
            .setFooter({ text: 'Take your time — no pressure 🌱' });

        await interaction.reply({ embeds: [embed] });
    }
};
