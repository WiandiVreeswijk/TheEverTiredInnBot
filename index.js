require('dotenv').config();
require('./database/init');
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
                continue;
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

    // ───── SLASH COMMANDS ─────
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

    // ───── BUTTON INTERACTIONS ─────
    if (!interaction.isButton()) return;

    // ───── MINECRAFT REFRESH ─────
    if (interaction.customId === 'minecraft_refresh') {
        const { getMinecraftStatus } = require('./commands/minecraft/getStatus');
        const { buildMinecraftEmbed } = require('./commands/minecraft/buildEmbed');

        const data = await getMinecraftStatus();
        const embed = buildMinecraftEmbed(data);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('minecraft_refresh')
                .setLabel('🔄 Refresh')
                .setStyle(ButtonStyle.Secondary)
        );

        return interaction.update({
            embeds: [embed],
            components: [row]
        });
    }

    // ───── EVENT DATE VOTING ─────
    if (interaction.customId.startsWith('eventvote_')) {
        const state = require('./commands/events/state');

        if (!state.activeEvent) {
            return interaction.reply({
                content: '❌ This event is no longer active.',
                ephemeral: true
            });
        }

        const proposalId = interaction.customId.replace('eventvote_', '');
        const proposal = state.activeEvent.proposals.find(p => p.id === proposalId);

        if (!proposal) {
            return interaction.reply({
                content: '❌ This option no longer exists.',
                ephemeral: true
            });
        }

        if (proposal.votes.includes(interaction.user.id)) {
            return interaction.reply({
                content: '⚠️ You already voted for this option.',
                ephemeral: true
            });
        }

        proposal.votes.push(interaction.user.id);

        const updatedButton = new ButtonBuilder()
            .setCustomId(`eventvote_${proposal.id}`)
            .setLabel(`Vote 🗳️ (${proposal.votes.length})`)
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(updatedButton);

        return interaction.update({ components: [row] });
    }

    // ───── MOVIE VOTING ─────
    if (interaction.customId.startsWith('vote_')) {
        const state = require('./commands/movie/state');
        const { saveMovieData } = require('./commands/movie/storage');

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
                content: '⚠️ You already voted!',
                ephemeral: true
            });
        }

        suggestion.votes.push(interaction.user.id);
        saveMovieData(state);

        const updatedButton = new ButtonBuilder()
            .setCustomId(`vote_${suggestion.id}`)
            .setLabel(`Vote 🎬 (${suggestion.votes.length})`)
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(updatedButton);

        return interaction.update({ components: [row] });
    }
});

client.login(process.env.DISCORD_TOKEN);
