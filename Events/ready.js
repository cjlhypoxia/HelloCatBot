const { Events, ActivityType } = require('discord.js');
const mongoose = require('mongoose');
const mongodb = process.env.mongodb;
mongoose.set('strictQuery', false);
module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		await mongoose.connect(mongodb)
			.then(() => console.log('Connected!'));
		if (mongoose.connect) {
			console.log('MongoDB連接成功');
		}
		// if (Levels.setURL(mongodb)) {
		//	console.log('MongoDB設定成功');
		// }
		client.user.setPresence({ status: 'dnd' });
		client.user.setActivity('試試 /google', { type: ActivityType.Playing });
		console.log(`Ready! ${client.user.tag} 上線`);
	},
};