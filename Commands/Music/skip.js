const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const client = require('../../index');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('跳過目前音樂'),
	async execute(interaction) {
		const { member, guild } = interaction;
		const voiceChannel = member.voice.channel;
		const embed = new EmbedBuilder();
		if (!voiceChannel) {
			embed.setColor('Red').setDescription('❌ 你必須在語音頻道內！');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
		if (!member.voice.channelId == guild.members.me.voice.channelId) {
			embed.setColor('Red').setDescription('❌ 錯誤！');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
		try {
			const queue = await client.distube.getQueue(voiceChannel);
			if (!queue) {
				embed.setColor('Red').setDescription('❌ 沒有播放清單！');
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
			else if (queue.songs.length === 1) {
				embed.setColor('Random').setDescription('❌ 沒有下一首歌可以播放！');
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
			else {
				await queue.skip(voiceChannel);
				embed.setColor('Blue').setDescription(`⏭️ 歌曲已跳過\n播放 \`${queue.songs[0].name}\``);
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
		}
		catch (err) {
			console.log(err);
			embed.setColor('Blue').setDescription('❌ 發生了錯誤！');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
	},
};