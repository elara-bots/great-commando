const Command = require('../base');
const moment = require('moment');
module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			group: 'util',
			memberName: 'ping',
			description: 'Shows the latency for the bot',
            examples: ['ping'],
			aliases: ["pong", "pung"],
			clientPermissions: ["EMBED_LINKS"],
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(msg) {

		let emojis = {
			"bot": "🤖",
			"loading": "⏱️"
		},
			color = msg.guild ? msg.guild.me.displayHexColor === "#000000" ? 0xFFBF00 : msg.guild.me.displayColor : 0xFFBF00,
			e1 = {
				author: {
					name: this.client.user.tag,
					icon_url: this.client.user.displayAvatarURL
				},
				color: color,
				description: `${emojis.loading} Loading, one moment please.`,
				timestamp: new Date()
			};
	const message = await msg.channel.send({embed: e1});
	message.edit({embed: {
		author: {
			name: this.client.user.tag,
			icon_url: this.client.user.displayAvatarURL
		},
		color: color,
		title: `${emojis.bot} Status ${emojis.bot}`,
		footer: {
			text: msg.author.tag,
			icon_url: msg.author.displayAvatarURL
		},
		fields: [
			{
				name: `Message Latency`, 
				value: `${message.createdTimestamp - msg.createdTimestamp}ms`,
				inline: true
			},
			{
				name: `API Latency`,
				value: `${Math.round(this.client.ping)}ms`,
				inline: true
			},
			{
				name: `Uptime`,
				value: `${moment.duration(this.client.uptime).format(`D [days], h [hours], m [minutes], s [seconds]`)}`,
				inline: true
			}
		]
	}});
	}
};
