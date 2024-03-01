const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('deletegoogle')
		.setDescription('delete google ai history'),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		const user = interaction;
		const pathfile = path.resolve('./Data/Prompt', `${user.id}_prompt.json`);
		if (fs.existsSync(pathfile)) {
			fs.unlinkSync(pathfile);
			return interaction.editReply('已刪除對話紀錄');
		}
		else {
			return interaction.editReply('刪除失敗，尚未有對話紀錄');
		}
	},
};