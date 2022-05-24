'use strict';

const { SlashCommandBuilder, userMention } = require('@discordjs/builders');

module.exports =
{
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Ping the bot.'),
	async execute(interaction)
	{
		await interaction.reply("towerbot, by " + userMention(86612976529838080) + ".");
	},
};