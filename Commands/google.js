const {SlashCommandBuilder, Integration} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('google')
        .setDescription('google ai'),
    async execute(interaction) {
        await interaction.reply('ok');
    },
};