const { Events, Collection } = require('discord.js');
const settingSchema = require('../../Models/setting.js');
module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction, client) {
		if (!interaction.isChatInputCommand()) return;
		const botonwer = '549137785181831179';
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}
		const { cooldowns } = interaction.client;
		if (!cooldowns.has(command.data.name)) {
			cooldowns.set(command.data.name, new Collection());
		}
		const now = Date.now();
		const timestamps = cooldowns.get(command.data.name);
		const defaultCooldownDuration = 5;
		const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

		if (timestamps.has(interaction.user.id)) {
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

			if (now < expirationTime) {
				const expiredTimestamp = Math.round(expirationTime / 1000);
				return interaction.reply({ content: `<@${interaction.user.id}>請稍等，<t:${expiredTimestamp}:R>再次使用 \`/${command.data.name}\` 指令。`, ephemeral: true });
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

		const { guildId } = interaction;
		await settingSchema.find({ Guild: guildId }).then(async (data) => {
			if (data.length == 0) {
				exe();
			}
			else if (data[0].Command.length > 0) {
				const arr = data[0].Command;
				if (arr.includes(command.data.name)) {
					return interaction.reply({ content: `此指令**/${command.data.name}**目前無法使用。`, ephemeral: true });
				}
				else {
					exe();
				}
			}
			else if (data[0].Command.length == 0) {
				exe();
			}
		}).catch((err) => console.log(err));


		async function exe() {
			try {
				await command.execute(interaction, client);
			}
			catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: `執行指令時發生錯誤請私訊 <@${botonwer}>`, ephemeral: true });
				}
				else {
					await interaction.reply({ content: `執行指令時發生錯誤請私訊 <@${botonwer}>`, ephemeral: true });
				}
			}
		}
	},
};