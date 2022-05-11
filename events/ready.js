'use strict';

const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('../config.json');
const { dbInit } = require('../utils/dbinit.js');

module.exports =
{
	name: 'ready',
	once: true,
	execute(client)
	{		
		//formerly deploy-commands.js, added into ready
		const commands = [];
		const commandFiles = fs.readdirSync(path.join(__dirname, "../commands")).filter(file => file.endsWith('.js'));

		for (const file of commandFiles)
		{
			const command = require(`../commands/${file}`);
			commands.push(command.data.toJSON());
		}

		const rest = new REST({ version: '9' }).setToken(token);

		rest.put(Routes.applicationCommands(clientId), { body: commands })
			.then(() => console.log('Successfully registered ' + commands.length + ' total commands.'))
			.catch(console.error);

		dbInit();
	}
}