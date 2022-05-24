'use strict';

const { Towers } = require('../utils/dbinit.js');

module.exports =
{
	name: 'interactionCreate',
	async execute(interaction)
	{
		if (interaction.isCommand())
			//handle command
		{
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) return;

			try
			{
				console.log(interaction.user.tag + " called /" + command.data.name + " in #" + interaction.channel.name);

				command.execute(interaction);
			} catch (error)
			{
				console.error(error);
				return interaction.reply('Whoops, something weird just happened. Pinging <@86612976529838080> to take a look at it.');
			}
		}
	}
}