const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deletegoogle')
		.setDescription('delete google ai history')
		.addStringOption(option =>
			option.setName('chat').setDescription('chat').setRequired(true)),
	async execute(interaction) {
		const prompt = interaction.options.getString('chat');
		const { user } = interaction;
		console.warn(prompt, user);
	},
};