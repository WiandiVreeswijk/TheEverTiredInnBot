const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('firesideinfo')
        .setDescription('Post information about how Fireside works'),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setTitle("🔥 Fireside Gatherings")
            .setDescription(
                "The fireside is a quiet space for 1-on-1 conversations.\n\n" +
                "**How it works:**\n" +
                "• A resident uses `/fireside` to light the fire.\n" +
                "• For 90 minutes, others may press **Sit by the Fire**.\n" +
                "• When the fire closes, residents are paired at random.\n" +
                "• Each pair receives a private temporary channel.\n\n" +
                "**Session details:**\n" +
                "• Sessions last up to **72 hours** of inactivity.\n" +
                "• Either participant may use `/endfireside` to close early.\n" +
                "• After 72 hours of silence, the fire fades automatically.\n\n" +
                "This is a space for gentle conversation.\n" +
                "There is no pressure, no performance, no obligation.\n\n" +
                "Sit when you feel ready. 🌿"
            )
            .setColor(0xE67E22)
            .setFooter({
                text: "Ever-Tired Inn • Slow connection, shared warmth"
            })

        await interaction.reply({
            embeds: [embed]
        })
    }
}