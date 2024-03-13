/* eslint-disable no-shadow */
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const url = 'https://api.stability.ai/v1/user/balance';
const apiKey = process.env.STABILITY_API_KEY;
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('看看還可以使用毛毛多少錢去玩以文生圖'),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		if (!apiKey) {
			return interaction.editReply('發生錯誤，請稍後再試');
		}
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${apiKey}`,
			},
		});
		if (!response.ok) {
			return interaction.editReply(`發生錯誤，請稍後再試\nNon-200 response: ${await response.text()}`);
		}
		const balance = (await response.json());
		const embed = new EmbedBuilder()
			.setTitle('毛毛還有多少錢')
			.setColor('Random')
			.setTimestamp()
			.addFields(
				{ name: '還有', value: `\`${balance.credits}\` 可使用於以文生圖` },
			);
		return interaction.editReply({ embeds:[embed] });
	},
};

