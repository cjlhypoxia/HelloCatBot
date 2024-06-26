// Require the necessary discord.js classes
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const { DisTube } = require('distube');
// const { SpotifyPlugin } = require('@distube/spotify');
const { loadEvents } = require('./Handlers/eventHandler');
const { loadCommands } = require('./Handlers/commandHandler');
// Create a new client instance
const client = new Client({
	intents: [Object.keys(GatewayIntentBits)],
	partials: [Object.keys(Partials)],
});

client.distube = new DisTube(client, {
	emitNewSongOnly: true,
	leaveOnFinish: true,
	leaveOnEmpty: false,
	emitAddSongWhenCreatingQueue: true,
});
// Commands
client.cooldowns = new Collection();
client.commands = new Collection();
/** const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}*/
// Events
/** const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	console.log(filePath, event);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}*/
module.exports = client;
client.login(process.env.BotToken).then(() => {
	loadEvents(client);
	loadCommands(client);
});