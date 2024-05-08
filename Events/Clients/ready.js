const { Events, ActivityType } = require('discord.js');
const mongoose = require('mongoose');
// const fs = require('fs');
// const path = require('path');
const mongodb = process.env.mongodb;

mongoose.set('strictQuery', false);
module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		await mongoose.connect(mongodb)
			.then(() => console.log('MongoDB已連接'));
		client.user.setPresence({ status: 'online' });
		client.user.setActivity('試試 /gemini', { type: ActivityType.Playing });
		console.log(`Ready! ${client.user.tag} 上線`);
		// const pathfile = path.resolve('./Data/Avatar/', 'giphy.gif');
		// const avatargif = fs.readFileSync(pathfile);
		// const avatar = Buffer.from(avatargif);
		// await client.user.setAvatar(avatar);
	},
};