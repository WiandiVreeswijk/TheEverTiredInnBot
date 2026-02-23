module.exports = function requireRole(...roles) {
    return async (interaction) => {
        if (!interaction.member) return false;

        const hasRole = interaction.member.roles.cache.some(role =>
            roles.includes(role.name)
        );

        if (!hasRole) {
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '⛔ You do not have permission to use this command.',
                    ephemeral: true
                });
            }
            return false;
        }

        return true;
    };
};