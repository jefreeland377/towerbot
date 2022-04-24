module.exports =
{
	name: 'interactionCreate',
	execute(interaction)
	{
		if (!interaction.isCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) return;

		try
		{
			command.execute(interaction);
		} catch (error)
		{
			console.error(error);
			return interaction.reply({ content: 'Whoops, something weird just happened. Pinging <@86612976529838080> to take a look at it.', ephemeral: true });
		}
	}
}