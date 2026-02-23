require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const interactionHandler = require('./handlers/interactionHandler');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', (interaction) => {
    interactionHandler(client, interaction);
});

client.login(process.env.DISCORD_TOKEN);
