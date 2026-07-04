const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

const topics = require('../../utils/gifTopics');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gifchallenge')
        .setDescription('Posts a random GIF challenge'),

    async execute(interaction) {

        const topic = topics[Math.floor(Math.random() * topics.length)];

        const embed = new EmbedBuilder()
            .setTitle("🎬 GIF Challenge")
            .setDescription(
                `Today's topic is:\n\n# **${topic}**\n\nFind the GIF that best matches today's topic!`
            )
            .setColor(0x9b59b6);

        const message = await interaction.reply({
            embeds: [embed],
            fetchReply: true
        });

        await message.react("😂");
        await message.react("❤️");
        await message.react("⭐");
    }
};