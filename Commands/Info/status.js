const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('查看機器人狀態'),
	async execute(interaction, client) {
		await interaction.deferReply({ ephemeral: true });
		const days = Math.floor(client.uptime / 86400000);
		const hours = Math.floor(client.uptime / 3600000) % 24;
		const minutes = Math.floor(client.uptime / 60000) % 60;
		const seconds = Math.floor(client.uptime / 1000) % 60;
		const embed = new EmbedBuilder()
			.setTitle(`${client.user.username} 的狀態`)
			.setColor('Random')
			.setTimestamp()
			.addFields(
				{ name: '運作時間', value: `\`${days}\` 天 \`${hours}\` 小時 \`${minutes}\` 分鐘 \`${seconds}\` 秒` },
			);
		return interaction.editReply({ embeds:[embed] });

	},
};