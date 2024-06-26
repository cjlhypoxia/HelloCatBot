const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const client = require('../../index');
const playlist = require('../../Data/Playlist/list.json');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('播放音樂')
		.addStringOption(option =>
			option.setName('歌曲')
				.setDescription('連結或名稱（不輸入則播放毛的音樂清單）'),
		),
	async execute(interaction) {
		const { options, member, guild, channel } = interaction;
		let query = options.getString('歌曲');
		const voiceChannel = member.voice.channel;
		const embed = new EmbedBuilder();
		if (!voiceChannel) {
			embed.setColor('Red').setDescription('❌ 你必須在語音頻道內！');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
		if (!member.voice.channelId == guild.members.me.voice.channelId) {
			embed.setColor('Red').setDescription('❌ 發生了錯誤！');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
		if (!query) {
			query = playlist.list;
		}
		try {
			embed.setColor('Green').setDescription('✅ 收到要求。');
			client.distube.play(voiceChannel, query, { textChannel: channel, member: member });
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
		catch (err) {
			console.log(err);
			embed.setColor('Blue').setDescription('❌ 發生了錯誤！');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
	},
};