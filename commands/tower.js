'use strict';

const { Sequelize, Op } = require('sequelize');
const { SlashCommandBuilder, channelMention } = require('@discordjs/builders');
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

		let server = interaction.guild;
		let channel = interaction.options.getChannel('channel');
		let pat = interaction.options.getString('pattern');
		switch (interaction.options.getSubcommand())
		{
			case 'add':
				try
				{
					if (!interaction.options.getChannel('channel').isText()) return interaction.reply("❎ That isn't a text channel!");

					const patRegExp = new RegExp(pat ? pat : defaultPattern);

					async function backCount(channel)
					//start looking through channels messages in backwards order
					//if message is bot, ignore
					//if message is nonbot, check against pattern
					//if message is nonbot and matches, increment height
					//if message is nonbot and doesnt match, end, we have our final height
					{
						let newHeight = -1; //because it increments in the first do-while iteration (very icky)
						let backPos = 0;
						let allMsgs = await channel.messages.fetch();
						let newResult = false;

						do
						{
							try 
							{
								newHeight++;

								while (allMsgs.at(newHeight+backPos).author.bot)
									backPos++;
							}
							catch (error)
							//array out of bounds! end of channel reached
							{
								console.log("error caught! (end of channel?) breaking out of backCount loop");
								break;
							}

						} while(patRegExp.test(allMsgs.at(newHeight+backPos).content));

						console.log("final height is " + newHeight);

						return newHeight;
					}

					let newHeight = await backCount(channel);

					//INSERT INTO Towers VALUES ...
					const query = await Towers.create({
						serverId: server.id,
						channelId: channel.id,
						pattern: (pat ? pat : defaultPattern),
						height: newHeight,
					});

					let reply = await interaction.reply("✅ I am now watching the tower in " + channelMention(channel.id) + "!");
					if (newHeight != 0) interaction.followUp("❗ Looks like there's already a tower here! I'm starting the height at " + newHeight + ". Happy stacking!");
					return;
				}
				catch (error)
				{
					if (error.name === 'SequelizeUniqueConstraintError')
						return interaction.reply("❎ That tower is already being watched!");
					console.log(error);
				}
				break;
			case 'remove':
				try
				{
					if (!interaction.options.getChannel('channel').isText()) return interaction.reply("❎ That isn't a text channel!");

					const query = await Towers.destroy({ where: {channelId: channel.id}});

					if (!query) return interaction.reply("❎ I was never watching this tower in the first place!");
					else return interaction.reply("✅ I am no longer watching the tower in " + channelMention(channel.id) + "!");
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