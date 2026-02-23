require('dotenv').config();

const validateEnv = require('./config/validateEnv');
validateEnv();

const { Client, GatewayIntentBits } = require('discord.js');
const interactionHandler = require('./handlers/interactionHandler');
const pool = require('./database/db');
const logger = require('./utils/logger');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// ─────────────────────────────
// Database Health Check
// ─────────────────────────────
(async () => {
    try {
        await pool.query('SELECT 1');
        logger.info('Database connected');
    } catch (err) {
        logger.error('Database connection failed');
        process.exit(1);
    }
})();

// ─────────────────────────────
// Bot Ready
// ─────────────────────────────
client.once('clientReady', () => {
    logger.info(`Logged in as ${client.user.tag}`);
});

// ─────────────────────────────
// Interaction Handling
// ─────────────────────────────
client.on('interactionCreate', (interaction) => {
    interactionHandler(client, interaction);
});

// ─────────────────────────────
// Graceful Shutdown
// ─────────────────────────────
process.on('SIGTERM', async () => {
    logger.warn('Shutting down (SIGTERM)');
    await pool.end();
    process.exit(0);
});

process.on('SIGINT', async () => {
    logger.warn('Manual shutdown (SIGINT)');
    await pool.end();
    process.exit(0);
});

client.login(process.env.DISCORD_TOKEN);
