const cron = require("node-cron");
const { EmbedBuilder } = require("discord.js");
const topics = require("../utils/gifTopics");

const CHANNEL_ID = "1523049089951072417";

function randomTopic() {
    return topics[Math.floor(Math.random() * topics.length)];
}

function startGifChallenge(client) {

    cron.schedule("30 22 * * *", async () => {

        const channel = await client.channels.fetch(CHANNEL_ID);

        if (!channel) return;

        const challenge = randomTopic();

        const embed = new EmbedBuilder()
            .setTitle("🎬 Daily GIF Challenge")
            .setColor(0xA855F7)
            .setDescription(
                `# **${challenge}**\n\nReply with the GIF that matches today's topic!\n\nThe community can vote using ❤️ 😂 ⭐.`
            );

        const message = await channel.send({
            embeds: [embed]
        });

        await message.react("❤️");
        await message.react("😂");
        await message.react("⭐");
    }, {
        timezone : "Europe/Amsterdam"
    });

    console.log("GIF Challenge scheduler started.");
}

module.exports = { startGifChallenge };