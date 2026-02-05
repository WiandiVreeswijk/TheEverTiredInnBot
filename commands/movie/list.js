const { SlashCommandBuilder } = require('discord.js');
const state = require('./state');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('Show all movie suggestions'),

    async execute(interaction) {
        if (state.suggestions.length === 0) {
            return interaction.reply('📭 No movie suggestions yet.');
        }

        const list = state.suggestions
            .map((s, index) =>
                `${index + 1}. 🎬 **${s.title}** — ${s.votes.length} vote(s)`
            )
            .join('\n');

        await interaction.reply({
            content: `🎥 **Movie Night Suggestions**\n\n${list}`
        });
    }
};