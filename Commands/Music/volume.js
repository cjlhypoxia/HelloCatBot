const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const client = require('../../index');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('volume')
		.setDescription('音量調整')
		.addIntegerOption(option =>
			option.setName('volume')
				.setDescription('10 = 10%')
				.setMinValue(0)
				.setMaxValue(100)
				.setRequired(true),
		),
	async execute(interaction) {
		const { options, member, guild } = interaction;
		const volume = options.getInteger('volume');
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
			client.distube.setVolume(voiceChannel, volume);
			return interaction.reply({ content: `🔊 音樂音量已設定為 ${volume}%` });
		}
		catch (err) {
			console.log(err);
			embed.setColor('Blue').setDescription('❌ 發生了錯誤！');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
	},
};