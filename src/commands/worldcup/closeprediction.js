const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js');

const predictionService = require('../../services/predictionService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('closeprediction')
        .setDescription('Close a World Cup prediction')
        .addStringOption(option =>
            option
                .setName('messageid')
                .setDescription('Message ID of the prediction')
                .setRequired(true)
        ),

    async execute(interaction) {

        const messageId =
            interaction.options.getString('messageid');

        const prediction =
            await predictionService.getPredictionByMessageId(
                messageId
            );

        if (!prediction) {
            return interaction.reply({
                content: '⚠️ Prediction not found.',
                ephemeral: true
            });
        }

        await predictionService.closePrediction(
            prediction.id
        );

        const predictionMessage =
            await interaction.channel.messages.fetch(
                messageId
            );

        const disabledRows =
            predictionMessage.components.map(row =>
                new ActionRowBuilder().addComponents(
                    row.components.map(button =>
                        ButtonBuilder
                            .from(button)
                            .setDisabled(true)
                    )
                )
            );

        await predictionMessage.edit({
            components: disabledRows
        });

        const votes =
            await predictionService.getVotes(
                prediction.id
            );

        const team1Votes = [];
        const drawVotes = [];
        const team2Votes = [];

        for (const vote of votes) {

            const user =
                await interaction.client.users.fetch(
                    vote.user_id
                );

            switch (vote.prediction) {

                case 'team1':
                    team1Votes.push(
                        `• ${user.username}`
                    );
                    break;

                case 'draw':
                    drawVotes.push(
                        `• ${user.username}`
                    );
                    break;

                case 'team2':
                    team2Votes.push(
                        `• ${user.username}`
                    );
                    break;
            }
        }

        const summary = [
            '🔒 **Prediction Closed**',
            '',
            `**${prediction.team1}**`,
            team1Votes.length
                ? team1Votes.join('\n')
                : '• Nobody',
            '',
            '🤝 **Draw**',
            drawVotes.length
                ? drawVotes.join('\n')
                : '• Nobody',
            '',
            `**${prediction.team2}**`,
            team2Votes.length
                ? team2Votes.join('\n')
                : '• Nobody'
        ].join('\n');

        await interaction.reply({
            content: summary
        });
    }
};