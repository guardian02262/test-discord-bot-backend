const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const crypto = require('../../utils/crypto');
const client = new Client({ intents: [
	"GUILDS",
    "GUILD_MEMBERS",
    "GUILD_BANS",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_MESSAGES",
] });
module.exports = client;
client.commands = new Collection();


// configs
const config = require('../../config')
const { connect } = require('./connect')
connect()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
// -----------------
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
	console.log(`[READY COMMAND] ${file}`)
}
// event handler
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(crypto.decrypt(config.token))

