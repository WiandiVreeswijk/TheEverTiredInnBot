const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const movieService = require('../services/movieService');

const commands = new Map();

// ─────────────────────────────
// Load Commands (with logging)
// ─────────────────────────────
function loadCommands() {
    const commandsPath = path.join(__dirname, '../commands');

    const commandFolders = fs.readdirSync(commandsPath);

    for (const folder of commandFolders) {
        const folderPath = path.join(commandsPath, folder);
        const commandFiles = fs
            .readdirSync(folderPath)
            .filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(folderPath, file);

            try {
                const command = require(filePath);

                if (!command.data || !command.execute) {
                    logger.warn(`Skipped invalid command file: ${file}`);
                    continue;
                }

                commands.set(command.data.name, command);
                logger.info(`Loaded command: ${command.data.name}`);

            } catch (err) {
                logger.error(`Failed loading command ${file}: ${err.message}`);
            }
        }
    }
}

loadCommands();

// ─────────────────────────────
// Safe Reply Helper
// ─────────────────────────────
async function safeReply(interaction, payload) {
    if (interaction.replied || interaction.deferred) {
        return interaction.followUp(payload);
    }
    return interaction.reply(payload);
}

// ─────────────────────────────
// Interaction Router
// ─────────────────────────────
module.exports = async (client, interaction) => {

    try {

        // ───── Slash Commands ─────
        if (interaction.isChatInputCommand()) {

            const command = commands.get(interaction.commandName);

            if (!command) {
                logger.warn(`Unknown command: ${interaction.commandName}`);
                return safeReply(interaction, {
                    content: '⚠️ Unknown command.',
                    ephemeral: true
                });
            }

            await command.execute(interaction);
            return;
        }

        // ───── Buttons ─────
        if (interaction.isButton()) {

            // Movie voting
            if (interaction.customId.startsWith('vote_')) {
                await movieService.handleVote(interaction);
                return;
            }

            logger.warn(`Unhandled button: ${interaction.customId}`);
        }

    } catch (error) {

        logger.error(error.stack || error);

        await safeReply(interaction, {
            content: '❌ Something went wrong while processing this interaction.',
            ephemeral: true
        });
    }
};