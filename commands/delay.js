const {pattern} = require('../config.json');

module.exports =
{
	name: 'delay',
	description: 'Set whether I should wait before notifying of a collapse. A good option if you don\'t want to single people out for causing a collapse. By default, I\'ll wait 12 hours before notifying.',
	args: true,
	usage: 'true/false',
	execute(message, args)
	{
		if (args[0] === 'true')
		{
			message.client.emit('setDelay', true);
			message.channel.send('Got it! Will send collapse notifications 12 hours late.');
		}
		else if (args[0] === 'false')
		{
			message.client.emit('setDelay', false);
			message.channel.send('Got it! Will send collapse notifications immediately.');
		}
		else
		{
			message.channel.send('I didn\'t understand. Use \"true\" or \"false\" instead.');
		}
	}
}