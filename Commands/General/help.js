const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('查看指令說明與幫助'),
	async execute(interaction) {
		const gourl = new ButtonBuilder()
			.setLabel('查看指令說明與幫助')
			.setURL('https://github.com/cjlhypoxia/HelloCatBot/blob/main/README.md')
			.setStyle(ButtonStyle.Link);
		const row = new ActionRowBuilder()
			.addComponents(gourl);
		interaction.reply({ components: [row], ephemeral: true });
	},
};