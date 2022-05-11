'use strict';

const { Sequelize, Op } = require('sequelize');

let sequelize = new Sequelize('database', 'user', 'password', {
		host: 'localhost',
		dialect: 'sqlite',
		logging: console.log,
		storage: 'database.sqlite',
	});

let Towers = sequelize.define('Tower', {
	serverId: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	channelId: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false,
	},
	pattern: Sequelize.STRING,
	height: Sequelize.INTEGER,
	delay: Sequelize.BOOLEAN,
	}, {underscored: true});

module.exports =
{
	Towers,	

	dbInit: async function ()
	{
		Towers.sync();
		console.log('Connection established with database.');
	}
}