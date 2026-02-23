require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

const commands = [];

// Resolve project root safely
const projectRoot = path.resolve(__dirname);

// Build absolute path to src/commands
const commandsRoot = path.join(projectRoot, 'src', 'commands');

// Safety check
if (!fs.existsSync(commandsRoot)) {
    console.error('❌ Could not find src/commands folder at:', commandsRoot);
    process.exit(1);
}

const commandFolders = fs.readdirSync(commandsRoot);

for (const folder of commandFolders) {
    const folderPath = path.join(commandsRoot, folder);

    // Skip non-folders
    if (!fs.lstatSync(folderPath).isDirectory()) continue;

    const commandFiles = fs
        .readdirSync(folderPath)
        .filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);

        if (!command.data || !command.execute) {
            continue;
        }

        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`📂 Using commands folder: ${commandsRoot}`);
        console.log('⏳ Registering slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );

        console.log(`✅ Successfully registered ${commands.length} commands.`);
    } catch (error) {
        console.error(error);
    }
})();