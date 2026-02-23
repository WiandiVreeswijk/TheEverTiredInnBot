const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('firesideqa')
        .setDescription('Frequently asked questions about Fireside'),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setTitle("🔥 Fireside — Questions & Answers")
            .setColor(0xE67E22)

            .addFields(
                {
                    name: "📝 Is Fireside text-based or voice?",
                    value: "Fireside sessions are **text-based only**. Each pair receives a temporary private text channel.",
                },
                {
                    name: "🎭 Is Fireside anonymous?",
                    value: "No. You will see the username of the person you are paired with once the private session channel is created.",
                },
                {
                    name: "⏳ When do I find out who I'm paired with?",
                    value: "When the gathering closes and pairings are created. You will see your partner in the private channel that opens.",
                },
                {
                    name: "🚪 How do I exit a private session?",
                    value: "Either participant can use `/endfireside` at any time to gently close the session.",
                },
                {
                    name: "💬 Do I have to talk immediately?",
                    value: "No. There is **no expectation of immediate conversation**. You can begin whenever you feel comfortable.",
                },
                {
                    name: "😰 I don’t want to leave someone hanging.",
                    value: "You are never required to carry a conversation. If you need to step away, you can say so for a maximum of 72 hours or use `/endfireside`. Sessions also close automatically after 72 hours of inactivity.",
                },
                {
                    name: "🔄 Can I join multiple gatherings?",
                    value: "You can join future gatherings, but you can only participate in one active session at a time.",
                },
                {
                    name: "⚖ What if I feel uncomfortable?",
                    value: "You may end the session at any time by using /endfireside. If something feels inappropriate, please contact the moderation team.",
                },
                {
                    name: "🌿 What is the purpose of Fireside?",
                    value: "Fireside was created to provide a slower, smaller way to connect — especially for those who feel overwhelmed by busy channels."
                }
            )

            .setFooter({
                text: "Ever-Tired Inn • Gentle connection, no pressure"
            })

        await interaction.reply({ embeds: [embed] })
    }
}