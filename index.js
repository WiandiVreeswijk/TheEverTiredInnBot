require('dotenv').config();
const {
    Client,
    GatewayIntentBits,
    ActivityType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const suggestions = [];
let votingOpen = true;


client.once('clientReady', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);

    client.user.setPresence({
        status: 'online',
        activities: [
            {
                name: 'Movie Night 🎬',
                type: ActivityType.Watching
            }
        ]
    });
});

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        const { commandName } = interaction;

        if (commandName === 'suggest') {
            if (!votingOpen) {
                return interaction.reply({
                    content: '⛔ Voting has ended. No more suggestions allowed.',
                    ephemeral: true
                });
            }
            const movie = interaction.options.getString('movie');

            const suggestion = {
                id: Date.now().toString(),
                title: movie,
                votes: []
            };

            suggestions.push(suggestion);

            const button = new ButtonBuilder()
                .setCustomId(`vote_${suggestion.id}`)
                .setLabel('Vote 🎬 (0)')
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder().addComponents(button);

            const message = await interaction.reply({
                content: `🎥 **${movie}**`,
                components: [row],
                fetchReply: true
            });

            suggestion.messageId = message.id;
        }

        if (commandName === 'list') {
            if (suggestions.length === 0) {
                return interaction.reply('📭 No movie suggestions yet.');
            }

            const list = suggestions
                .map((s, index) => {
                    return `${index + 1}. 🎬 **${s.title}** — ${s.votes.length} vote(s)`;
                })
                .join('\n');

            return interaction.reply({
                content: `🎥 **Movie Night Suggestions**\n\n${list}`
            });
        }
        if (commandName === 'endvote') {
            if (!interaction.memberPermissions.has('Administrator')) {
                return interaction.reply({
                    content: '⛔ Only admins can end the vote.',
                    ephemeral: true
                });
            }

            if (suggestions.length === 0) {
                return interaction.reply('📭 No movies were suggested.');
            }

            votingOpen = false;

            const sorted = [...suggestions].sort(
                (a, b) => b.votes.length - a.votes.length
            );

            const topVotes = sorted[0].votes.length;
            const winners = sorted.filter(s => s.votes.length === topVotes);

            let resultText;

            if (topVotes === 0) {
                resultText = '😅 No one voted. Movie night is cancelled!';
            } else if (winners.length === 1) {
                resultText = `🏆 **Winner:** 🎬 **${winners[0].title}** with **${topVotes} votes**!`;
            } else {
                const titles = winners.map(w => `🎬 **${w.title}**`).join(', ');
                resultText = `🤝 **It’s a tie!** Winners (${topVotes} votes each):\n${titles}`;
            }

            // Disable all buttons (already working)
            for (const s of suggestions) {
                try {
                    const channel = interaction.channel;
                    const message = await channel.messages.fetch(s.messageId);

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

            // 🔄 RESET FOR NEXT ROUND
            suggestions.length = 0;
            votingOpen = true;

            return interaction.reply(resultText);
        }

        if (commandName === 'fluteguy') {
            return interaction.reply({
                embeds: [
                    {
                        image: {
                            url: 'https://tenor.com/view/the-game-awards-flute-afro-the-game-awards-flute-player-kino-klan-gif-24959759'
                        }
                    }
                ]
            });
        }
    }

    if (interaction.isButton()) {
        const suggestionId = interaction.customId.replace('vote_', '');
        const suggestion = suggestions.find(s => s.id === suggestionId);

        if (!suggestion) {
            return interaction.reply({
                content: '❌ This vote is no longer valid.',
                ephemeral: true
            });
        }

        if (suggestion.votes.includes(interaction.user.id)) {
            return interaction.reply({
                content: '⚠️ You already voted for this movie!',
                ephemeral: true
            });
        }

        suggestion.votes.push(interaction.user.id);

        const updatedButton = new ButtonBuilder()
            .setCustomId(`vote_${suggestion.id}`)
            .setLabel(`Vote 🎬 (${suggestion.votes.length})`)
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(updatedButton);

        return interaction.update({
            components: [row]
        });
    }
});

client.login(process.env.DISCORD_TOKEN);
