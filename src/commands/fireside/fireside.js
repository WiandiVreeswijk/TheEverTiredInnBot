const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const firesideService = require('../../services/firesideService')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fireside')
        .setDescription('Light the fire and open a gathering'),

    async execute(interaction) {

        const existing = await firesideService.getActiveGathering()

        if (existing) {
            return interaction.reply({
                content: "🔥 The fire is already burning.",
                ephemeral: true
            })
        }

        const embed = new EmbedBuilder()
            .setTitle("🔥 The Fire Is Lit")
            .setDescription("For the next 90 minutes, guests may sit by the fire.\n\n🌿 Currently sitting: **1 guest**")

        const button = new ButtonBuilder()
            .setCustomId('sit_fire')
            .setLabel('🌿 Sit by the Fire')
            .setStyle(ButtonStyle.Primary)

        const row = new ActionRowBuilder().addComponents(button)

        const message = await interaction.reply({
            embeds: [embed],
            components: [row],
            fetchReply: true
        })

        await firesideService.createGathering(
            message.id,
            message.channel.id,
            interaction.user.id,
            90 * 60 * 1000
        )
    }
}