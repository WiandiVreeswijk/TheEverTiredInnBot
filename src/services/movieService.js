const pool = require('../database/db');
const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

async function createMovie(title) {
    const id = Date.now().toString();

    await pool.query(
        'INSERT INTO movies (id, title) VALUES ($1, $2)',
        [id, title]
    );

    return id;
}

async function getMovies() {
    const result = await pool.query(`
        SELECT m.id, m.title, COUNT(v.user_id) AS votes
        FROM movies m
        LEFT JOIN votes v ON m.id = v.movie_id
        GROUP BY m.id
        ORDER BY votes DESC
    `);

    return result.rows;
}

async function handleVote(interaction) {
    const movieId = interaction.customId.replace('vote_', '');

    const existing = await pool.query(
        'SELECT * FROM votes WHERE movie_id = $1 AND user_id = $2',
        [movieId, interaction.user.id]
    );

    if (existing.rows.length > 0) {
        return interaction.reply({
            content: '⚠️ You already voted!',
            ephemeral: true
        });
    }

    await pool.query(
        'INSERT INTO votes (movie_id, user_id) VALUES ($1, $2)',
        [movieId, interaction.user.id]
    );

    const countResult = await pool.query(
        'SELECT COUNT(*) FROM votes WHERE movie_id = $1',
        [movieId]
    );

    const voteCount = countResult.rows[0].count;

    const updatedButton = new ButtonBuilder()
        .setCustomId(`vote_${movieId}`)
        .setLabel(`Vote 🎬 (${voteCount})`)
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(updatedButton);

    await interaction.update({ components: [row] });
}

module.exports = {
    createMovie,
    getMovies,
    handleVote
};