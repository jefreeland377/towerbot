const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('../config.json');

module.exports =
{
	name: 'ready',
	once: true,
	execute(client)
	{
		towerChannel = null;
		notifyChannel = null;
		delay = false;
		height = 0;
		
		//formerly deploy-commands.js, added into ready
		const commands = [];
		const commandFiles = fs.readdirSync(path.join(__dirname, "../commands")).filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			const command = require(`../commands/${file}`);
			commands.push(command.data.toJSON());
		}

		const rest = new REST({ version: '9' }).setToken(token);

		rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
			.then(() => console.log('Successfully registered ' + commands.length + ' total commands.'))
			.catch(console.error);

		console.log('Ready!');
	}
}