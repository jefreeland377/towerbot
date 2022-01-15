module.exports =
{
	name: 'ready',
	once: true,
	execute(client)
	{
		towerChannel = null;
		notifyChannel = null;
		delay = false;
		height = 0;
		
		console.log('Ready!\n');
	}
}