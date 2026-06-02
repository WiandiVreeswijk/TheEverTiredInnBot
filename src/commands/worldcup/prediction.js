const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require('discord.js');

const predictionService = require('../../services/predictionService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prediction')
        .setDescription('Create a World Cup prediction')
        .addStringOption(option =>
            option
                .setName('date')
                .setDescription('Match date (YYYY-MM-DD)')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('team1')
                .setDescription('First team')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('team2')
                .setDescription('Second team')
                .setRequired(true)
        ),

    async execute(interaction) {

        const date = interaction.options.getString('date');
        const team1 = interaction.options.getString('team1');
        const team2 = interaction.options.getString('team2');

        const predictionId =
            await predictionService.createPrediction(
                date,
                team1,
                team2,
                interaction.user.id
            );

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(
                        `prediction_${predictionId}_team1`
                    )
                    .setLabel(`${team1} (0)`)
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId(
                        `prediction_${predictionId}_draw`
                    )
                    .setLabel('Draw (0)')
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId(
                        `prediction_${predictionId}_team2`
                    )
                    .setLabel(`${team2} (0)`)
                    .setStyle(ButtonStyle.Danger)
            );

        const embed = new EmbedBuilder()
            .setTitle('🏆 World Cup 2026 Prediction')
            .setDescription(
                `📅 **${date}**\n\n**${team1} vs ${team2}**`
            )
            .setColor(0x5865F2)
            .setFooter({
                text: `Created by ${interaction.user.username}`
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
};