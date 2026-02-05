const {
    SlashCommandBuilder,
    PermissionsBitField,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const state = require('./state');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('endvote')
        .setDescription('End voting and announce the winning movie')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    async execute(interaction) {
        if (state.suggestions.length === 0) {
            return interaction.reply('📭 No movies were suggested.');
        }

        state.votingOpen = false;

        const sorted = [...state.suggestions].sort(
            (a, b) => b.votes.length - a.votes.length
        );

        const topVotes = sorted[0].votes.length;
        const winners = sorted.filter(s => s.votes.length === topVotes);

        let resultText;

        if (topVotes === 0) {
            resultText = '😅 No one voted. Movie night is cancelled!';
        } else if (winners.length === 1) {
            resultText =
                `🏆 **Winner:** 🎬 **${winners[0].title}** ` +
                `with **${topVotes} votes**!`;
        } else {
            const titles = winners.map(w => `🎬 **${w.title}**`).join(', ');
            resultText =
                `🤝 **It’s a tie!** Winners (${topVotes} votes each):\n${titles}`;
        }

        for (const s of state.suggestions) {
            try {
                const message = await interaction.channel.messages.fetch(s.messageId);

                const disabledRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`vote_${s.id}`)
                        .setLabel(`Vote 🎬 (${s.votes.length})`)
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true)
                );

                await message.edit({ components: [disabledRow] });
            } catch {}
        }

        state.suggestions.length = 0;
        state.votingOpen = true;

        await interaction.reply(resultText);
    }
};