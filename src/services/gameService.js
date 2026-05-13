const pool = require('../database/db');
const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

async function createGame(title) {
    const id = Date.now().toString();

    await pool.query(
        'INSERT INTO retro_games (id, title) VALUES ($1, $2)',
        [id, title]
    );

    return id;
}

async function getGames() {
    const result = await pool.query(`
        SELECT g.id, g.title, COUNT(v.user_id) AS votes
        FROM retro_games g
                 LEFT JOIN retro_votes v ON g.id = v.game_id
        GROUP BY g.id
        ORDER BY votes DESC
    `);

    return result.rows;
}

async function gameExists(title) {
    const result = await pool.query(
        'SELECT 1 FROM retro_games WHERE LOWER(title) = LOWER($1)',
        [title]
    );

    return result.rows.length > 0;
}

async function handleVote(interaction) {
    const gameId = interaction.customId.replace('vote_', '');

    const existing = await pool.query(
        'SELECT * FROM retro_votes WHERE game_id = $1 AND user_id = $2',
        [gameId, interaction.user.id]
    );

    if (existing.rows.length > 0) {
        return interaction.reply({
            content: '⚠️ You already voted for a game!',
            ephemeral: true
        });
    }

    await pool.query(
        'INSERT INTO retro_votes (game_id, user_id) VALUES ($1, $2)',
        [gameId, interaction.user.id]
    );

    const countResult = await pool.query(
        'SELECT COUNT(*) FROM retro_votes WHERE game_id = $1',
        [gameId]
    );

    const voteCount = countResult.rows[0].count;

    const updatedButton = new ButtonBuilder()
        .setCustomId(`vote_${gameId}`)
        .setLabel(`Vote 🕹️ (${voteCount})`)
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(updatedButton);

    await interaction.update({ components: [row] });
}

module.exports = {
    createGame,
    getGames,
    handleVote,
    gameExists
};