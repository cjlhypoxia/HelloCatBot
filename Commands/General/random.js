const { SlashCommandBuilder, AttachmentBuilder, inlineCode } = require('discord.js');
const fs = require('fs');
module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('random')
		.setDescription('隨機查看過去的以文生圖')
		.addStringOption(option =>
			option.setName('風格').setDescription('選擇特定的風格').setRequired(false)
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
		let style = interaction.options.getString('風格');
		let randomvalue = 0, attachment_url = 0, nullstyle = 0;
		fs.readdir('./Data/Image/', (err, files) => {
			if (err) throw err;
			const filterfile = files.filter((file) => file.includes(style));
			if (filterfile.length == 0 | style == null) {
				if (style != null) {
					nullstyle = `無 ${style} 風格，但有這個`;
					style = nullstyle;
				}
				else {
					style = '隨機風格';
				}
				randomvalue = Math.floor(Math.random() * files.length);
				attachment_url = files[randomvalue];
			}
			else {
				randomvalue = Math.floor(Math.random() * filterfile.length);
				attachment_url = filterfile[randomvalue];
			}
			const attachment = new AttachmentBuilder(`./Data/Image/${attachment_url}`);
			return interaction.editReply({ content: `Style : ${style}`, files: [attachment] });
		});
	},
};