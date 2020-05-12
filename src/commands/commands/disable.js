const { oneLine } = require('common-tags');
const Command = require('../base');

module.exports = class DisableCommandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'disable',
			aliases: ['disable-command', 'cmd-off', 'command-off'],
			group: 'commands',
			memberName: 'disable',
			description: 'Disables a command or command group.',
			details: oneLine`
				The argument must be the name/ID (partial or whole) of a command or command group.
				Only administrators may use this command.
			`,
			examples: ['disable util', 'disable Utility', 'disable prefix'],
			guarded: true,

			args: [
				{
					key: 'cmdOrGrp',
					label: 'command/group',
					prompt: 'Which command or group would you like to disable?',
					type: 'group|command'
				}
			]
		});
	}

	hasPermission(msg) {
		if(!msg.guild) return this.client.isOwner(msg.author);
		return msg.member.hasPermission('ADMINISTRATOR') || this.client.isOwner(msg.author);
	}

	run(msg, args) {
		if(!args.cmdOrGrp.isEnabledIn(msg.guild, true)) return this.client.send(msg, `${args.cmdOrGrp.group ? "Command" : "Group"} (\`${args.cmdOrGrp.name}\`) is already disabled.`);
		if(args.cmdOrGrp.guarded)  return this.client.send(msg, `${args.cmdOrGrp.group ? "Command" : "Group"} (\`${args.cmdOrGrp.name}\`) is guarded, you can't disable it.`);
		args.cmdOrGrp.setEnabledIn(msg.guild, false);
		return this.client.send(msg, `${args.cmdOrGrp.group ? "Command" : "Group"} (\`${args.cmdOrGrp.name}\`) is disabled now.`);
	}
};
