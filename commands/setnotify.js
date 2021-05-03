const {process.env.pattern} = require('../config.json');

module.exports =
{
	name: 'setnotify',
	description: 'Set the channel that I\'ll notify when the tower collapses.',
	args: true,
	usage: '<channelId>/remove',
	execute(message, args)
	{
		towerChannel = require('../index.js');
		
		if (args[0] == 'remove')
		{
			message.client.emit('setNotify', null);
			message.channel.send('I will no longer notify any channel.');
		}
		else if (typeof(args[0] === 'number'))
		{
			message.client.emit('setNotify', args[0]);
			message.channel.send('I will now notify <#' + args[0] + '> of collapses!');
		}
		else
		{
			message.channel.send('I couldn\'t find that channel ID!');
		}
	}
}