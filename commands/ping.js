module.exports =
{
	name: 'ping',
	description: 'Ping the bot.',
	execute(message, args)
	{
		message.channel.send('towerbot v. prerelease, by definitely_not_HIM#5832.');
	}
}