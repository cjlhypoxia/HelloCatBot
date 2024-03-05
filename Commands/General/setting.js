const { SlashCommandBuilder, ChannelType } = require('discord.js');
const settingSchema = require('../../Models/setting.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('setting')
		.setDescription('功能設定')
		.addSubcommand(subcommand =>
			subcommand
				.setName('gemini頻道設定')
				.setDescription('選擇指定聊天的文字頻道')
				.addChannelOption(option =>	option
					.setName('頻道')
					.setDescription('選擇文字頻道')
					.addChannelTypes(ChannelType.GuildText)
					.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('訊息反應設定')
				.setDescription('開啟或關閉機器人自動反應表情')
				.addBooleanOption(option => option
					.setName('選擇')
					.setDescription('選擇開啟或關閉')
					.setRequired(true),
				),
		),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		const { user, options, guild } = interaction;
		const subcommandname = options.getSubcommand();
		if (user.id !== guild.ownerId) {
			return interaction.editReply({ content: '你沒有權限更改設定。', ephemeral: true });
		}
		else if (subcommandname === 'gemini設定') {
			const textchannel = options.getChannel('頻道');
			await settingSchema.find({ Guild: guild.id }).then(async (data) => {
				console.log(data.length);
				if (data.length == 0) {
					settingSchema.create({
						Guild: guild.id,
						Aichannelid: textchannel.id,
						Reactoption: null,
					});
				}
				else {
					const filter = { Guild: guild.id };
					const update = { Aichannelid: textchannel.id };
					await settingSchema.findOneAndUpdate(filter, update, {
						new: true,
					});
				}
			}).catch((err) => console.log(err));
			return interaction.editReply({ content: '設定成功。', ephemeral: true });
		}
		else {
			const boolenoption = options.getBoolean('選擇');
			console.log(boolenoption);
			return interaction.editReply({ content: '設定成功。', ephemeral: true });
		}
	},
};