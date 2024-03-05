const settingSchema = require('../../Models/setting.js');
module.exports = {
	name: 'messageCreate',
	async execute(message, client) {
		const { guildId } = message;
		await settingSchema.find({ Guild: guildId }).then(async (data) => {
			if (data.length != 0) {
				if (data[0].Reactoption == false) {
					return;
				}
				else {
					react();
				}
			}
			else {
				react();
			}
		});
		function react() {
			const getemoji = client.emojis.cache;
			const emoji = getemoji.map((guildemoji) => {
				return {
					name: guildemoji.name,
					id: guildemoji.id,
				};
			});
			const selectemoji = emoji[Math.floor(Math.random() * emoji.length)];
			if (message.author.bot === false) {
				message.react(`<:${selectemoji.name}:${selectemoji.id}>`);
			}
			else {
				return;
			}
		}
	},

};