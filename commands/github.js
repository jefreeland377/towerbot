module.exports =
{
	name: 'github',
	description: 'Link my Github repository.',
	execute(message, args)
	{
		message.channel.send('https://github.com/jefreeland377/towerbot');
	}
}