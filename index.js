const fs = require('fs');
const CronJob = require('cron').CronJob;
const { Client, Collection, Intents } = require('discord.js');
const { token, pattern } = require('./config.json');
const collapseEmbed = require('./collapse-embed.js');

let towerChannel;
let notifyChannel;
let delay;
let height;

// create a new Discord client
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.commands = new Collection();
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

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
			client.emit('setHeight', height + 1);
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