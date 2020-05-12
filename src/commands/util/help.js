const Command = require('../base');
const RichDisplay = require("../../extensions/react/RichDisplay");
const Discord = require('discord.js');

module.exports = class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            group: 'util',
            memberName: 'help',
            aliases: [`h`, `halp`, `command`, `commands`],
            description: 'Displays a list of available commands, or detailed information for a specified command.',
            details: `The command may be part of a command name or a whole command name.\nIf it isn't specified, all available commands will be listed.`,
            examples: [`${client.commandPrefix}help`, `${client.commandPrefix}help prefix`],
			guarded: true,
			clientPermissions: ["EMBED_LINKS"],
            throttling: {
                usages: 1,
                duration: 10
            },
            args: [{
                key: 'command',
                prompt: 'Which command would you like to view the help for?',
                type: 'string',
                default: ''
            }]
        });
    }

    async run(msg, args) { 
      try{
        if(msg.guild){
        if(!msg.channel.permissionsFor(this.client.user.id).has('ADD_REACTIONS')) return this.client.send(msg, `Sorry but I'm unable to send the help message, I don't have "Add Reactions" in this channel. 🙁`)
        }
		let color = msg.guild ? msg.guild.me.displayHexColor === "#000000" ? 0xFFBF00 : msg.guild.me.displayColor : 0xFFBF00;
        let user = this.client.user;
        const groups = this.client.registry.groups;
        const commands = this.client.registry.findCommands(args.command, false, msg);
        const showAll = args.command && args.command.toLowerCase() === 'all';
		if(args.command === "groups") return msg.channel.send({embed: {
			author: {
				name: this.client.user.tag,
				icon_url: this.client.user.displayAvatarURL
			},
			color: color,
			title: `All Groups`,
			description: `${groups.map(c => `${c.name} (\`${c.id}\`): ${c.commands.size} commands`).join('\n')}`
		}})
        if(args.command && !showAll){
             if(commands.length === 1){
                  let cmd = commands[0];
                  if(!this.client.isOwner(msg.author.id) && cmd.hidden === true) return null;
                  let misc = [], perms = [];
				  if(cmd.guildOnly === true) misc.push(`**Server Only: **✔`)
				  if(cmd.dmOnly === true) misc.push(`**DM Only:** ✔`)
                  if(cmd.nsfw === true) misc.push(`**NSFW Only: **✔`)
                  if(cmd.guarded === true) misc.push(`**Guarded: **✔`)
                  if(cmd.userPermissions !== null) perms.push(`**User Permissions: **${cmd.userPermissions.join(", ")}`)
                  if(cmd.clientPermissions !== null) perms.push(`**Bot Permissions: **${cmd.clientPermissions.join(", ")}`)
                  let e = new Discord.RichEmbed()
                  .setAuthor(user.tag, user.displayAvatarURL)
                  .setColor(color)
                  .setTitle(`Command Help`)
                  .setDescription(`
                  **Name: **${cmd.name}${
                  cmd.aliases.length !== 0 ? `\n**Aliases: **${cmd.aliases.join(", ")}` : ""}
                  **Group: **${cmd.group.name}${cmd.details !== null ? `\n**Details: **${cmd.details}` : ""}${cmd.examples !== null ? `\n**Examples: **${cmd.examples.join(", ")}` : ""}
                  **Description: **${cmd.description}${misc.length !== 0 ? `\n${misc.join("\n")}` : ""}${perms.length !== 0 ? `\n${perms.join("\n")}`: ""}
                  `)
                  return msg.say(e)
             }
        }else{
            if(msg.guild){
            let e = new Discord.RichEmbed().setAuthor(msg.guild.name, msg.guild.iconURL).setColor(color)
            let display = new RichDisplay(e)
            groups.forEach(g => {
                let commands = g.commands.map(c => `**${c.name}**${c.nsfw ? "(NSFW)" : ""} - ${c.description}`)
                display.addPage(e => e.setDescription(`${commands.join('\n')}`).setTitle(g.name))
            });
            display.setFooterPrefix('Here are all of the commands you can use. Page: ')
            display.run(await msg.channel.send(`Loading...`), { filter: (reaction, user) => user.id === msg.author.id})
        }else{
         return msg.direct({embed: {
			 author: {
				 name: this.client.user.tag,
				 icon_url: this.client.user.displayAvatarURL
			 },
			 title: "INFO",
			 description: `This command can only be used in a server channel.`,
			 timestamp: new Date(),
			 color: color
		 }}).catch(() => {})
        }
    }
      }catch(e){
			console.log(e.stack);
			return this.client.send(msg, `There was an error with the command: \`\`\`js\n${e.message}\`\`\``)
      }
}
};