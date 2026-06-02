const pool = require('../database/db');
const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

async function createPrediction(
    matchDate,
    team1,
    team2,
    createdBy
) {
    const id = Date.now().toString();

    await pool.query(`
        INSERT INTO predictions (
            id,
            match_date,
            team1,
            team2,
            created_by
        )
        VALUES ($1, $2, $3, $4, $5)
    `, [
        id,
        matchDate,
        team1,
        team2,
        createdBy
    ]);

    return id;
}

async function getPrediction(id) {
    const result = await pool.query(`
        SELECT *
        FROM predictions
        WHERE id = $1
    `, [id]);

    return result.rows[0];
}

async function getVoteCounts(predictionId) {
    const result = await pool.query(`
        SELECT
            prediction,
            COUNT(*) as count
        FROM prediction_votes
        WHERE prediction_id = $1
        GROUP BY prediction
    `, [predictionId]);

    return {
        team1: Number(
            result.rows.find(r => r.prediction === 'team1')?.count || 0
        ),
        draw: Number(
            result.rows.find(r => r.prediction === 'draw')?.count || 0
        ),
        team2: Number(
            result.rows.find(r => r.prediction === 'team2')?.count || 0
        )
    };
}

async function handleVote(interaction) {

    const [, predictionId, choice] =
        interaction.customId.split('_');

    const prediction = await getPrediction(predictionId);

    if (!prediction) {
        return interaction.reply({
            content: '⚠️ Prediction not found.',
            ephemeral: true
        });
    }

    if (prediction.status === 'closed') {
        return interaction.reply({
            content: '🔒 This prediction has been closed.',
            ephemeral: true
        });
    }

    await pool.query(`
        INSERT INTO prediction_votes (
            prediction_id,
            user_id,
            prediction
        )
        VALUES ($1, $2, $3)
        ON CONFLICT (prediction_id, user_id)
        DO UPDATE SET prediction = EXCLUDED.prediction
    `, [
        predictionId,
        interaction.user.id,
        choice
    ]);

    const counts =
        await getVoteCounts(predictionId);

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(
                    `prediction_${predictionId}_team1`
                )
                .setLabel(
                    `${prediction.team1} (${counts.team1})`
                )
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId(
                    `prediction_${predictionId}_draw`
                )
                .setLabel(
                    `Draw (${counts.draw})`
                )
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId(
                    `prediction_${predictionId}_team2`
                )
                .setLabel(
                    `${prediction.team2} (${counts.team2})`
                )
                .setStyle(ButtonStyle.Danger)
        );

    await interaction.update({
        components: [row]
    });
}

async function closePrediction(predictionId) {
    await pool.query(`
        UPDATE predictions
        SET status = 'closed'
        WHERE id = $1
    `, [predictionId]);
}

async function getVotes(predictionId) {
    const result = await pool.query(`
        SELECT
            user_id,
            prediction
        FROM prediction_votes
        WHERE prediction_id = $1
        ORDER BY prediction, user_id
    `, [predictionId]);

    return result.rows;
}

async function setMessageId(
    predictionId,
    messageId
) {
    await pool.query(`
        UPDATE predictions
        SET message_id = $1
        WHERE id = $2
    `, [
        messageId,
        predictionId
    ]);
}

async function getPredictionByMessageId(
    messageId
) {
    const result = await pool.query(`
        SELECT *
        FROM predictions
        WHERE message_id = $1
    `, [messageId]);

    return result.rows[0];
}

module.exports = {
    createPrediction,
    getPrediction,
    getVoteCounts,
    handleVote,
    closePrediction,
    getVotes,
    getPredictionByMessageId,
    setMessageId
};