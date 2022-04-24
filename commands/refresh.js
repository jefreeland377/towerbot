const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('../config.json');

module.exports =
{
	data: new SlashCommandBuilder()
		.setName('refresh')
		.setDescription('Update the list of slash commands in this server.'),
	async execute(interaction)
	{
		const commands = [];
		const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			const command = require(`./${file}`);
			commands.push(command.data.toJSON());
		}

		const rest = new REST({ version: '9' }).setToken(token);

		rest.put(Routes.applicationGuildCommands(clientId, interaction.guildId), { body: commands })
			.then(() => interaction.reply('Successfully registered ' + commands.length + ' total commands.'))
			.catch(console.error);
	},
};




