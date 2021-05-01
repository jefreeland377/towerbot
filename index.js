const fs = require('fs');
const CronJob = require('cron').CronJob;
const Discord = require('discord.js');
const { pattern, prefix, token } = require('./config.json');
const collapseEmbed = require('./collapse-embed.js');

let towerChannel;
let notifyChannel;
let delay;
let height;

// create a new Discord client
const client = new Discord.Client();

//retrieve the list of commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles)
{
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () =>
{
	towerChannel = null;
	notifyChannel = null;
	delay = false;
	height = 0;
	
	console.log('Ready!\n');
});

client.on('message', message =>
{
	//first, handle tower messages
	if (towerChannel != null)
	{
		if (message.channel == towerChannel)
				checkMessage(message);
	}
	
	//then, handle commands
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	
	if (!client.commands.has(commandName)) return;
	const command = client.commands.get(commandName);
	
	if (command.args && !args.length)
	{
		return message.channel.send(`${message.author}, the proper usage is ${prefix}${command.name} ${command.usage}`);
	}

	try
	{
		command.execute(message, args);
	} catch (error)
	{
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.on('setTower', newChannel =>
{
	towerChannel = newChannel;
	console.log('setTower: towerChannel is now ' + towerChannel);
});

client.on('setNotify', newChannel =>
{
	notifyChannel = newChannel;
	console.log('setNotify: notifyChannel is now ' + notifyChannel);
});

client.on('setHeight', newHeight =>
{
	height = newHeight;
	console.log('setHeight: height is now ' + height);
});

client.on('setDelay', newDelay =>
{
	delay = newDelay;
	console.log('setDelay: delay is now ' + delay);
});

function checkMessage(message)
{
	if (!message.author.bot)
	{
		if (message.content == pattern)
		{
			height++;
			console.log('height is now ' + height);
		}
		else if (height != 0)
		{
			console.log('tower has toppled!');
			collapseEmbed.description = 'The tower was ' + height + ' hand' + (height == 1 ? '' : 's') + ' tall.';
			
			const channel = (notifyChannel ? notifyChannel : towerChannel);
			if (delay)
				sendDelayedMessage(message, channel);
			else
				message.client.channels.cache.get(channel).send({embed: collapseEmbed});
				
			client.emit('setHeight', 0);
		}
	}
}

function sendDelayedMessage(message, channel)
{
	let schedule = new Date();
	schedule.setHours(schedule.getHours() + 12);
	
	let job = new CronJob(schedule, function(message)
	{
		console.log('sending delayed message');
		client.channels.cache.get(channel).send({embed: collapseEmbed});
		job.stop();
	}, null, true, 'America/New_York');
	
	console.log('delayed message scheduled for ' + schedule + ' in ' + channel);
}

// login to Discord with your app's token
client.login(token);