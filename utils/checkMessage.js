const { defaultPattern } = require('../config.json');

module.exports =
{
	checkMessage: function (message)
	{
		const query = await Towers.findOne({ attributes: ['pattern'], where: {serverId: message.guildId}});

		const pattern = RegExp(query ? query : defaultPattern);

		if(pattern.test(message.content))
		{

		}
		else
		{

		}
	}
}