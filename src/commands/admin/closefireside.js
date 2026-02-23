const { SlashCommandBuilder } = require('discord.js')
const firesideService = require('../../services/firesideService')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('closefireside')
        .setDescription('Manually close the active fireside gathering'),

    async execute(interaction) {

        const allowed = interaction.member.permissions.has('Administrator')

        if (!allowed) {
            return interaction.reply({
                content: '⛔ Admin only.',
                ephemeral: true
            })
        }

        const result = await firesideService.closeActiveGathering(interaction.client)

        await interaction.reply({
            content: result.error || result.message,
            ephemeral: true
        })
    }
}