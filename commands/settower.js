const {process.env.pattern} = require('../config.json');

module.exports =
{
	name: 'settower',
	description: 'Set the channel that I\'ll watch for collapses.',
	args: true,
	usage: '<channelId>/remove',
	execute(message, args)
	{
		towerChannel = require('../index.js');
		
		if (args[0] == 'remove')
		{
			message.client.emit('setTower', null);
			message.client.emit('setHeight', 0);
			message.channel.send('I am no longer watching a channel.');
		}
		else if (typeof(args[0] === 'number'))
		{
			message.client.emit('setTower', args[0]);
			message.channel.send('I am now watching <#' + args[0] + '>!');
			countBack();
		}
		else
		{
			message.channel.send('I couldn\'t find that channel ID!');
		}
		
		function countBack()
		{
			const channel = message.client.channels.cache.get(args[0]);

			channel.messages.fetch()
			.then(messages =>
			{
				const filtered = messages.filter(fmsg => fmsg.content != process.env.pattern);
				const culprit = filtered.first();
				
				const current = channel.messages.fetch({after: culprit.id})
				.then(cmsg =>
				{
					const newHeight = cmsg.size;
					message.client.emit('setHeight', newHeight);
					if (newHeight != 0)
						message.channel.send('I found ' + newHeight +
						' hands already in that channel! My, you guys are fast.\nHappy stacking! 👐');
				})
				.catch(console.error);
				
				
			})
			.catch(console.error);
		}
	}
}