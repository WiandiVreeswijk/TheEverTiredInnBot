const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("minecraft")
        .setDescription("How to join The Ever-Tired Inn Minecraft server"),

    async execute(interaction) {
        const introEmbed = new EmbedBuilder()
            .setTitle("🎮 The Ever-Tired Inn — Minecraft Server")
            .setColor(0x57f287)
            .setDescription(
                "This server runs on **Minecraft Bedrock Edition**.\n\n" +
                "**You can join from:**\n" +
                "- Windows 10 / 11\n" +
                "- Xbox\n" +
                "- PlayStation\n" +
                "- Nintendo Switch\n" +
                "- iOS (iPhone / iPad)\n" +
                "- Android"
            )
            .addFields(
                { name: "🌐 Server Address (IP)", value: "`152.228.198.219`", inline: true },
                { name: "🔌 Port", value: "`19132`", inline: true }
            );

        const pcMobileEmbed = new EmbedBuilder()
            .setTitle("🖥️📱 Windows & Mobile")
            .setColor(0x3498db)
            .setDescription(
                "**Windows 10 / 11 (Minecraft for Windows)**\n" +
                "1. Open Minecraft\n" +
                "2. Click **Play** → **Servers**\n" +
                "3. Scroll down → **Add Server**\n" +
                "4. Enter:\n" +
                "   - Server Name: *The Ever-Tired Inn*\n" +
                "   - Address: `152.228.198.219`\n" +
                "   - Port: `19132`\n" +
                "5. Save → Join\n\n" +
                "**Android / iOS**\n" +
                "1. Open Minecraft → **Play** → **Servers**\n" +
                "2. Scroll down → **Add Server**\n" +
                "3. Enter the same IP & port\n" +
                "4. Save → Tap to join\n\n" +
                "📶 Make sure you’re connected to the internet."
            );

        const consoleEmbed = new EmbedBuilder()
            .setTitle("🎮 Consoles")
            .setColor(0xf1c40f)
            .setDescription(
                "**Xbox**\n" +
                "✔ Recommended:\n" +
                "- Sign in to Xbox Live\n" +
                "- Add the server owner as a friend\n" +
                "- Go to **Play → Friends** and join\n\n" +
                "⚠ If \"Add Server\" is available, you can try entering IP + port directly.\n\n" +
                "**PlayStation (PS4 / PS5)**\n" +
                "- Sign in with a Microsoft/Xbox account\n" +
                "- Go to **Play → Servers → Add Server**\n" +
                "- If missing: join via Friends tab\n\n" +
                "**Nintendo Switch**\n" +
                "- Sign in with a Microsoft account\n" +
                "- Add the server owner as a friend\n" +
                "- Join via **Play → Friends**\n" +
                "_Helper apps like BedrockTogether may help, but are often not needed._"
            );

        const issuesEmbed = new EmbedBuilder()
            .setTitle("❗ Common Issues & Server Info")
            .setColor(0xe74c3c)
            .setDescription(
                "**Unable to connect to world?**\n" +
                "- Double-check IP & port\n" +
                "- Restart Minecraft\n" +
                "- Make sure you’re on **Bedrock**, not Java\n\n" +
                "**Multiplayer not allowed?**\n" +
                "- Check Microsoft/Xbox privacy settings\n" +
                "- Enable multiplayer\n\n" +
                "**Server Rules & Settings**\n" +
                "✅ Keep inventory on death\n" +
                "✅ Mob griefing disabled\n" +
                "🌱 Survival server\n" +
                "🧡 Friendly, chill environment"
            );

        await interaction.reply({
            embeds: [introEmbed, pcMobileEmbed, consoleEmbed, issuesEmbed]
        });
    }
};