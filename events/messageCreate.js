'use strict';

const { defaultPattern } = require('../config.json');
const { Towers } = require('../utils/dbinit.js');

module.exports =
{
	name: 'messageCreate',
	async execute(message)
	{
		const query = await Towers.findOne({ attributes: ['pattern', 'height'], where: {channelId: message.channelId}});

		if (query)
		{
			//formerly utils/checkMessage.js

			const pattern = new RegExp(query.pattern ? query.pattern : defaultPattern);
			//if this tower has a pattern set, use that one. otherwise, use the default pattern in the config

			console.log("testing if " + query.pattern + " matches " + pattern + "... returns " + pattern.test(message.content));
			if (pattern.test(message.content))
			{
				//pattern matches! add to height
				const query2 = await Towers.update({ height: query.height + 1 }, {where: {channelId: message.channelId}});
			}
			else
			{
				//pattern does not match! tower collapses!
				const query2 = await Towers.update({ height: 0 }, {where: {channelId: message.channelId}});
			}
		}
	}
}