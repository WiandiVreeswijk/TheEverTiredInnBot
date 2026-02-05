require('dotenv').config();

const fs = require('fs');
const path = require('path');
const {
    Client,
    GatewayIntentBits,
    ActivityType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// ─────────────────────────────
// Load commands
// ─────────────────────────────
client.commands = new Map();

const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
    const commandFolders = fs.readdirSync(commandsPath);

    for (const folder of commandFolders) {
        const folderPath = path.join(commandsPath, folder);
        const commandFiles = fs
            .readdirSync(folderPath)
            .filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(folderPath, file);
            const command = require(filePath);

            if (!command.data || !command.execute) {
                continue; // skip non-command files like state.js
            }

            client.commands.set(command.data.name, command);
        }
    }
}

// ─────────────────────────────
// Bot ready
// ─────────────────────────────
client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);

    client.user.setPresence({
        status: 'online',
        activities: [
            {
                name: 'Movie Night 🎬',
                type: ActivityType.Watching
            }
        ]
    });
});

// ─────────────────────────────
// Interaction handling
// ─────────────────────────────
client.on('interactionCreate', async interaction => {
    // Slash commands
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: '❌ Something went wrong running this command.',
                ephemeral: true
            });
        }
    }

    // Button interactions (movie voting)
    if (interaction.isButton()) {
        const state = require('./commands/movie/state');

        const suggestionId = interaction.customId.replace('vote_', '');
        const suggestion = state.suggestions.find(s => s.id === suggestionId);

        if (!suggestion) {
            return interaction.reply({
                content: '❌ This vote is no longer valid.',
                ephemeral: true
            });
        }

        if (suggestion.votes.includes(interaction.user.id)) {
            return interaction.reply({
                content: '⚠️ You already voted for this movie!',
                ephemeral: true
            });
        }

        suggestion.votes.push(interaction.user.id);

        const updatedButton = new ButtonBuilder()
            .setCustomId(`vote_${suggestion.id}`)
            .setLabel(`Vote 🎬 (${suggestion.votes.length})`)
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(updatedButton);

        if (interaction.customId === 'steamfriend_reply') {
            return interaction.reply({
                content:
                    '👋 Want to add them?\n\n' +
                    'Share **your** Steam Friend Code using:\n' +
                    '`/steamfriend code:YOUR_CODE`\n\n' +
                    'Steam → Friends → Add a Friend → Friend Code',
                ephemeral: true
            });
        }

        await interaction.update({ components: [row] });
    }
});

client.login(process.env.DISCORD_TOKEN);