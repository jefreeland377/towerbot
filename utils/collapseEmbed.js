'use strict';

let footers =
[
	"Only one way to go but up!",
	"How about another go?",
	"Maybe next time...",
	"Oops, my bad.",
	"Well, it was probably going to happen anyway..."
];

module.exports =
{
	color: 0x6388ad,
	footer:
	{
		text: footers[Math.floor(Math.random() * footers.length)];
	},
	image:
	{
		url: 'collapse.png',
	},
	title: 'The tower has collapsed!',
	timestamp: new Date()
}