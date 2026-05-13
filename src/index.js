require('dotenv').config();

const validateEnv = require('./config/validateEnv');
validateEnv();

const { Client, GatewayIntentBits } = require('discord.js');
const interactionHandler = require('./handlers/interactionHandler');
const pool = require('./database/db');
const logger = require('./utils/logger');
const firesideService = require('./services/firesideService');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers
    ]
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

    setInterval(async () => {
        try {
            await firesideService.checkExpiredGatherings(client)
            await firesideService.checkExpiredSessions(client)
        } catch (err) {
            logger.error('Fireside background job failed')
            logger.error(err.stack || err)
        }
    }, 60 * 1000)
});

// ─────────────────────────────
// Interaction Handling
// ─────────────────────────────
client.on('interactionCreate', (interaction) => {
    interactionHandler(client, interaction);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    try {
        await firesideService.touchSession(message.channel.id);
    } catch (err) {
        logger.error('Failed updating fireside session timestamp');
        logger.error(err.stack || err);
    }
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
