const { stripIndents, oneLine } = require('common-tags');
const Command = require('../base');

module.exports = class PrefixCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'prefix',
			group: 'util',
			memberName: 'prefix',
			description: 'Shows or sets the command prefix.',
			format: '[prefix/"default"/"none"]',
			details: oneLine`
				If no prefix is provided, the current prefix will be shown.
				If the prefix is "default", the prefix will be reset to the bot's default prefix.
				If the prefix is "none", the prefix will be removed entirely, only allowing mentions to run commands.
				Only administrators may change the prefix.
			`,
			examples: ['prefix', 'prefix -', 'prefix omg!', 'prefix default', 'prefix none'],

			args: [
				{
					key: 'prefix',
					prompt: 'What would you like to set the bot\'s prefix to?',
					type: 'string',
					max: 15,
					default: ''
				}
			]
		});
	}

	async run(msg, args) {
		// Just output the prefix

		if(!args.prefix) return this.client.send(msg, `**__Prefix__**\n${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}`);

		if(msg.guild){
			if(!msg.member.permissions.has("MANAGE_GUILD") && !this.client.isOwner(msg.author.id)) return this.client.send(msg, `**__Prefix__**\n${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}`)
		}else
		if(!this.client.isOwner(msg.author.id)) return this.client.send(msg, `**__Prefix__**\n${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}`)
		if(msg.guild){
			if(msg.guild.commandPrefix === args.prefix.toLowerCase()) return this.client.send(msg, `**__Prefix__**\n${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}`);
			if(["reset", "clear", "remove"].includes(args.prefix.toLowerCase())) {
				msg.guild.commandPrefix = null;
				return this.client.send(msg, `**__Prefix Reset__**\n${this.client.commandPrefix}`);
			};
			msg.guild.commandPrefix = args.prefix.toLowerCase();
			return this.client.send(msg, `**__Prefix Changed__**\n${args.prefix.toLowerCase()}`);
		}else{
			if(!this.client.isOwner(msg.author.id)) this.client.send(msg, `**__Prefix__**\n${this.client.commandPrefix}`);
			this.client.commandPrefix = args.prefix.toLowerCase();
			this.client.send(msg, `**__Prefix Changed__**\n${this.client.commandPrefix}`);
		}
		return this.client.send(msg, `**__Prefix__**\n${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}`);
	}
};
