const { SlashCommandBuilder } = require('discord.js');
const state = require('./state');
const { saveMovieData } = require('./storage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('endvote')
        .setDescription('End voting and announce the winner'),

    async execute(interaction) {
        if (state.suggestions.length === 0) {
            return interaction.reply('📭 No movies were suggested.');
        }

        state.votingOpen = false;

        const sorted = [...state.suggestions].sort(
            (a, b) => b.votes.length - a.votes.length
        );

        const topVotes = sorted[0].votes.length;
        const winners = sorted.filter(s => s.votes.length === topVotes);

        let result;

        if (topVotes === 0) {
            result = '😅 No one voted. Movie night cancelled!';
        } else if (winners.length === 1) {
            result = `🏆 Winner: 🎬 **${winners[0].title}** (${topVotes} votes)`;
        } else {
            const tied = winners.map(w => `🎬 **${w.title}**`).join(', ');
            result = `🤝 It’s a tie (${topVotes} votes each):\n${tied}`;
        }

        state.suggestions = [];
        state.votingOpen = true;

        saveMovieData(state);

        await interaction.reply(result);
    }
};