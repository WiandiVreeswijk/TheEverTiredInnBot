const fs = require('fs');
const path = require('path');

const commands = new Map();

const commandsPath = path.join(__dirname, '../commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);

        if (!command.data || !command.execute) continue;

        commands.set(command.data.name, command);
    }
}

module.exports = async (client, interaction) => {

    if (interaction.isChatInputCommand()) {
        const command = commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: '❌ Something went wrong.',
                ephemeral: true
            });
        }
    }

    if (interaction.isButton()) {
        if (interaction.customId.startsWith('vote_')) {
            const movieService = require('../services/movieService');
            await movieService.handleVote(interaction);
        }
    }
};