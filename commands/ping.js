const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports =
{
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Ping the bot.'),
	async execute(interaction)
	{
		await interaction.reply('towerbot, by definitely_not_HIM#5832.');
	},
};