const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('minecraft-status')
        .setDescription('Show the current status of the Minecraft server'),

    async execute(interaction) {
        try {
            const res = await fetch(
                'https://api.mcsrvstat.us/bedrock/2/152.228.198.219:19132'
            );
            const data = await res.json();

            if (!data.online) {
                return interaction.reply({
                    content: '⛔ The Minecraft server is currently offline.',
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setTitle('⛏️ Minecraft Server Status')
                .setColor(0x4caf50)
                .addFields(
                    {
                        name: 'Status',
                        value: '🟢 Online',
                        inline: true
                    },
                    {
                        name: 'Players',
                        value: `👥 ${data.players.online} / ${data.players.max}`,
                        inline: true
                    },
                    {
                        name: 'Server IP',
                        value: '`152.228.198.219`',
                        inline: false
                    }
                )
                .setFooter({
                    text: 'Bedrock Edition'
                });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: '❌ Unable to fetch Minecraft server status.',
                ephemeral: true
            });
        }
    }
};
