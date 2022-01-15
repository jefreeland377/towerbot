const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports =
{
	data: new SlashCommandBuilder()
		.setName('github')
		.setDescription('Link my Github repository.'),
	async execute(interaction)
	{
		await interaction.reply('https://github.com/jefreeland377/towerbot');
	}
}