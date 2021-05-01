module.exports =
{
	name: 'measure',
	description: '',
	args: true,
	usage: '<int: hands>',
	execute(message, args)
	{
		if (!isNaN(parseInt(args[0])))
		{
			const data = [];
			const avgFeet = Math.round(args[0] * 3.287402 / 12 * 100) / 100;
			const handsFeet = Math.round(args[0] * 4 / 12 * 100) / 100;
			data.push('\`' + args[0] + '\` hands is equal to:');
			data.push('\`' + avgFeet + '\` feet (\`' + (Math.round(avgFeet / 3.281 * 100) / 100) + '\` meters), according to the average hand breadth of 8.25 centimeters');
			data.push('\`' + handsFeet + '\` feet (\`' + (Math.round(handsFeet / 3.281 * 100) / 100) + '\` meters), according to the literal unit \'hands\'');
			
			message.channel.send(data);
		}
		else
		{
			message.channel.send('I didn\'t understand. Are you sure you gave a number?');
		}
	}
}