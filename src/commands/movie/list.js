const { SlashCommandBuilder } = require('discord.js');
const movieService = require('../../services/movieService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('Show movie suggestions'),

    async execute(interaction) {
        const movies = await movieService.getMovies();

        if (movies.length === 0) {
            return interaction.reply('📭 No movie suggestions yet.');
        }

        const list = movies
            .map((m, i) =>
                `${i + 1}. 🎬 **${m.title}** — ${m.votes} vote(s)`
            )
            .join('\n');

        await interaction.reply({
            content: `🎥 **Movie Night Suggestions**\n\n${list}`
        });
    }
};