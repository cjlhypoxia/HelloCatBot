const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const translate = require('@iamtraction/google-translate');
/* eslint-disable no-shadow */
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require('fs');
const engineId = 'stable-diffusion-xl-1024-v1-0';
const url = `https://api.stability.ai/v1/generation/${engineId}/text-to-image`;
const apiKey = process.env.STABILITY_API_KEY;
module.exports = {
	data: new SlashCommandBuilder()
		.setName('image')
		.setDescription('用文字生成圖片')
		.addStringOption(option =>
			option.setName('文字').setDescription('輸入你想像的一段文字').setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		const prompt = interaction.options.getString('文字');
		const translateprompt = await translate(prompt, { to: 'en' });
		// const attachment = new AttachmentBuilder('./Data/Image/v1_txt2img_0.png');
		// return interaction.editReply({ content: `${prompt}`, files: [attachment] });
		if (!apiKey) {
			return interaction.editReply('發生錯誤，請稍後再試');
		}
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				text_prompts: [
					{
						text: translateprompt.text,
					},
				],
				cfg_scale: 7,
				height: 1024,
				width: 1024,
				steps: 20,
				samples: 1,
			}),
		},
		);
		if (!response.ok) {
			return interaction.editReply(`發生錯誤，請稍後再試\nNon-200 response: ${await response.text()}`);
		}
		const responseJSON = await response.json();
		responseJSON.artifacts.forEach((image, index) => {
			fs.writeFileSync(`./Data/Image/v1_txt2img_${responseJSON.artifacts.seed}_${index}.png`, Buffer.from(image.base64, 'base64'));
			const attachment = new AttachmentBuilder(`./Data/Image/v1_txt2img_${responseJSON.artifacts.seed}_${index}.png`);
			return interaction.editReply({ content: `${prompt}`, files: [attachment] });
		});
	},
};