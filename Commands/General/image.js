const { SlashCommandBuilder, AttachmentBuilder, inlineCode } = require('discord.js');
const translate = require('@iamtraction/google-translate');
/* eslint-disable no-shadow */
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require('fs');
const engineId = 'stable-diffusion-xl-1024-v1-0';
const url = `https://api.stability.ai/v1/generation/${engineId}/text-to-image`;
const apiKey = process.env.STABILITY_API_KEY;
module.exports = {
	cooldown: 15,
	data: new SlashCommandBuilder()
		.setName('image')
		.setDescription('用文字生成圖片（Stable Diffusion XL 1.0）')
		.addStringOption(option =>
			option.setName('文字').setDescription('輸入你想像的一段文字').setRequired(true))
		.addStringOption(option =>
			option.setName('風格').setDescription('選擇想要的風格（不選則由AI依語意創作）').setRequired(false)
				.addChoices(
					{ name: '3D模型（3d-model）', value: '3d-model' },
					{ name: '類比底片（analog-film）', value: 'analog-film' },
					{ name: '卡通風格（anime）', value: 'anime' },
					{ name: '電影風格（cinematic）', value: 'cinematic' },
					{ name: '漫畫風格（comic-book）', value: 'comic-book' },
					{ name: '數位藝術（digital-art）', value: 'digital-art' },
					{ name: '增強風格（enhance）', value: 'enhance' },
					{ name: '幻想藝術（fantasy-art）', value: 'fantasy-art' },
					{ name: '等距藝術（isometric）', value: 'isometric' },
					{ name: '線條藝術（line-art）', value: 'line-art' },
					{ name: '低多邊形（low-poly）', value: 'low-poly' },
					{ name: '黏土塑形（modeling-compound）', value: 'modeling-compound' },
					{ name: '賽博龐克（neon-punk）', value: 'neon-punk' },
					{ name: '摺紙藝術（origami）', value: 'origami' },
					{ name: '攝影風格（photographic）', value: 'photographic' },
					{ name: '像素藝術（pixel-art）', value: 'pixel-art' },
					{ name: '平鋪紋理（tile-texture）', value: 'tile-texture' },
				),
		),
	async execute(interaction) {
		await interaction.deferReply();
		const prompt = interaction.options.getString('文字');
		const style = interaction.options.getString('風格');
		const inline = inlineCode('Prompt：' + prompt + `\nStyle：${style}`);
		const translateprompt = await translate(prompt, { to: 'en' });
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
				style_preset: style,
			}),
		},
		);
		if (!response.ok) {
			return interaction.editReply(`發生錯誤，請稍後再試\nNon-200 response: ${await response.text()}`);
		}
		const responseJSON = await response.json();
		responseJSON.artifacts.forEach((image, index) => {
			fs.writeFileSync(`./Data/Image/v1_txt2img_${interaction.id}_${index}.png`, Buffer.from(image.base64, 'base64'));
			const attachment = new AttachmentBuilder(`./Data/Image/v1_txt2img_${interaction.id}_${index}_${style}.png`);
			return interaction.editReply({ content: `<@${interaction.user.id}> ${inline}`, files: [attachment] });
		});
	},
};