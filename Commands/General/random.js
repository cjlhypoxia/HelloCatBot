const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
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
			const pathfile = path.resolve('./Data/Prompt', `${interaction.guild.id}_txt2image.json`);
			if (fs.existsSync(pathfile)) {
				fs.readFile(`./Data/Prompt/${interaction.guild.id}_txt2image.json`, 'utf8', (err, data) => {
					if (err) {
						return interaction.editReply({ content : '發生錯誤 reading file', ephemeral: true });
					}
					try {
						const jsonData = JSON.parse(data);
						const filteredData = jsonData.data.filter(item => attachment_url.includes(item.id));
						const image = new AttachmentBuilder(`./Data/Image/${attachment_url}`);
						if (filteredData.length == 0) {
							const embed = new EmbedBuilder()
								.setTitle('Random txt2img')
								.setColor('Random')
								.setTimestamp()
								.setImage(`attachment://${attachment_url}`)
								.addFields(
									{ name: 'Author', value: '無資料', inline: true },
									// eslint-disable-next-line no-useless-escape
									{ name: 'Prompt', value: '\`無資料\`', inline: true },
									{ name: 'Style', value: `\`${style}\``, inline: false },
								);
							const action = new ButtonBuilder()
								.setLabel('儲存圖片').setURL(`http://168.138.212.23/Data/Image/${attachment_url}`).setStyle('Link').setEmoji('⬇️');
							const row = new ActionRowBuilder().addComponents(action);
							return interaction.editReply({ embeds: [embed], files:[image], components: [row] });
						}
						else {
							const embed = new EmbedBuilder()
								.setTitle('Random txt2img')
								.setColor('Random')
								.setTimestamp()
								.setImage(`attachment://${attachment_url}`)
								.addFields(
									{ name: 'Author', value: `<@${filteredData[0].author}>`, inline: true },
									{ name: 'Prompt', value: `\`${filteredData[0].prompt}\``, inline: true },
									{ name: 'Style', value: `\`${filteredData[0].style}\``, inline: false },
								);
							const action = new ButtonBuilder()
								.setLabel('儲存圖片').setURL(`http://168.138.212.23/Data/Image/${attachment_url}`).setStyle('Link').setEmoji('⬇️');
							const row = new ActionRowBuilder().addComponents(action);
							return interaction.editReply({ embeds: [embed], files:[image], components: [row] });
						}
					}
					catch (parseError) {
						console.log(parseError);
						return interaction.editReply({ content : '發生錯誤 parseError', ephemeral: true });
					}
				});
			}
			else {
				const image = new AttachmentBuilder(`./Data/Image/${attachment_url}`);
				const embed = new EmbedBuilder()
					.setTitle('Random txt2img')
					.setColor('Random')
					.setTimestamp()
					.setImage(`attachment://${attachment_url}`)
					.addFields(
						{ name: 'Author', value: '無資料', inline: true },
						// eslint-disable-next-line no-useless-escape
						{ name: 'Prompt', value: '\`無資料\`', inline: true },
						{ name: 'Style', value: `\`${style}\``, inline: false },
					);
				const action = new ButtonBuilder()
					.setLabel('儲存圖片').setURL(`http://168.138.212.23/Data/Image/${attachment_url}`).setStyle('Link').setEmoji('⬇️');
				const row = new ActionRowBuilder().addComponents(action);
				return interaction.editReply({ embeds: [embed], files:[image], components: [row] });
			}
		});
	},
};