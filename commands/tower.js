'use strict';

const { Sequelize, Op } = require('sequelize');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { defaultPattern } = require('../config.json');
const { Towers } = require('../utils/dbinit.js');

module.exports =
{
	data: new SlashCommandBuilder()
		.setName('tower')
		.setDescription('Mess with towers')
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Add a new tower for the bot to watch')
				.addChannelOption(option =>
					option.setName('channel')
					.setDescription('The channel with the tower')
					.setRequired(true))
				.addStringOption(option =>
					option.setName('pattern')
					.setDescription('the regex pattern to watch (default: \"' + defaultPattern + '\"")')
					.setRequired(false)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Stop watching a tower')
				.addChannelOption(option =>
					option.setName('channel')
					.setDescription('The channel with the tower')
					.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('view')
				.setDescription('View information about a tower')
				.addChannelOption(option =>
					option.setName('channel')
					.setDescription('The channel with the tower')
					.setRequired(true))),
	async execute(interaction)
	{
		if (!interaction.options.getChannel('channel'))
			return interaction.reply("❎ Hmm... I can't find that channel.");

		let server = interaction.guildId;
		let channel = interaction.options.getChannel('channel').id;
		switch (interaction.options.getSubcommand())
		{
			case 'add':
				try
				{
					if (!interaction.options.getChannel('channel').isText()) return interaction.reply("❎ That isn't a text channel!");

					//INSERT INTO Towers VALUES ...
					const query = await Towers.create({
						serverId: server,
						channelId: channel,
						pattern: (interaction.options.getString('pattern') ? interaction.options.getString('pattern') : defaultPattern),
						height: 0,
						delay: false,
					});

					return interaction.reply("✅ I am now watching the tower in <#" + interaction.options.getChannel('channel').id + ">!");
				}
				catch (error)
				{
					if (error.name === 'SequelizeUniqueConstraintError')
						return interaction.reply("❎ That tower is already being watched!");
				}
				break;
			case 'remove':
				try
				{
					if (!interaction.options.getChannel('channel').isText()) return interaction.reply("❎ That isn't a text channel!");

					const query = await Towers.destroy({ where: {channelId: channel}});

					if (!query) return interaction.reply("❎ I was never watching this tower in the first place!");
					else return interaction.reply("✅ I am no longer watching the tower in <#" + interaction.options.getChannel('channel').id + ">.");
				}
				catch (error)
				{
					console.log(error);
				}
				break;
			case 'view':

				break;
		}
	},
};