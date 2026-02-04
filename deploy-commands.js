require('dotenv').config();
const { REST, Routes, SlashCommandBuilder, PermissionsBitField } = require('discord.js');

const commands = [
    new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Suggest a movie for movie night')
        .addStringOption(option =>
            option
                .setName('movie')
                .setDescription('Movie title')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('list')
        .setDescription('Show all movie suggestions'),

    new SlashCommandBuilder()
        .setName('fluteguy')
        .setDescription('Summon the legendary flute guy 🎶'),

    new SlashCommandBuilder()
        .setName('endvote')
        .setDescription('End voting and announce the winning movie')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)

].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('⏳ Registering slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );

        console.log('✅ Slash commands registered.');
    } catch (error) {
        console.error(error);
    }
})();


