const { EmbedBuilder } = require('discord.js');
const client = require('../../index');
module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		const { member, guild, customId } = interaction;
		const voiceChannel = member.voice.channel;
		const embed = new EmbedBuilder().setColor('Random');
		if (!interaction.isButton()) return;
		if (!['pause', 'resume', 'shuffle', 'skip', 'nowplaying'].includes(customId)) return;
		if (!voiceChannel) {
			embed.setColor('Red').setDescription('❌ 你必須在語音頻道內');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
		if (!member.voice.channelId == guild.members.me.voice.channelId) {
			embed.setColor('Red').setDescription('❌ 錯誤');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
		const queue = await client.distube.getQueue(voiceChannel);
		if (!queue) {
			embed.setColor('Red').setDescription('❌ 沒有播放清單');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
		switch (customId) {
		case 'pause' :
			try {
				await queue.pause(voiceChannel);
				embed.setColor('Blue').setDescription(`⏸️ 歌曲已暫停 - <@${interaction.user.id}>`);
				return interaction.reply({ embeds: [embed] });
			}
			catch (err) {
				console.log(err);
				embed.setColor('Blue').setDescription('❌ 發生了錯誤');
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
		case 'resume' :
			try {
				await queue.resume(voiceChannel);
				embed.setColor('Blue').setDescription(`▶️ 歌曲已恢復播放 \`${queue.songs[0].name}\` - <@${interaction.user.id}>`);
				return interaction.reply({ embeds: [embed] });
			}
			catch (err) {
				console.log(err);
				embed.setColor('Blue').setDescription('❌ 發生了錯誤');
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
		case 'shuffle' :
			try {
				await queue.shuffle();
				embed.setColor('Blue').setDescription(`🔀 已打亂清單中的音樂 - <@${interaction.user.id}>`);
				return interaction.reply({ embeds: [embed] });
			}
			catch (err) {
				console.log(err);
				embed.setColor('Blue').setDescription('❌ 發生了錯誤');
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
		case 'skip' :
			try {
				if (!queue) {
					embed.setColor('Red').setDescription('❌ 沒有播放清單');
					return interaction.reply({ embeds: [embed], ephemeral: true });
				}
				else if (queue.songs.length === 1) {
					embed.setColor('Random').setDescription('❌ 沒有下一首歌可以播放');
					return interaction.reply({ embeds: [embed], ephemeral: true });
				}
				else {
					await queue.skip(voiceChannel);
					embed.setColor('Blue').setDescription(`⏭️ 歌曲已跳過 - <@${interaction.user.id}>\n播放 ${queue.songs[0].name}`);
					return interaction.reply({ embeds: [embed] });
				}
			}
			catch (err) {
				console.log(err);
				embed.setColor('Blue').setDescription('❌ 發生了錯誤');
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
		case 'nowplaying' :
			try {
				const song = queue.songs[0];
				embed.setColor('Blue').setDescription(`⏭️ **正在播放** \`${song.name}\` - \`${song.formattedDuration}\` \n**連結：** ${song.url}`).setThumbnail(song.thumbnail);
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
			catch (err) {
				console.log(err);
				embed.setColor('Blue').setDescription('⏭️ 發生了錯誤');
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
		}
	},
};