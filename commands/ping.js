const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports =
{
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Ping the bot.'),
	async execute(interaction)
	{
		await interaction.reply('towerbot v1.02, by definitely_not_HIM#5832.');
	},
};