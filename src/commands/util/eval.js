const util = require('util'),
      escapeRegex = require('escape-string-regexp'),
      Command = require('../base'),
      moment = require('moment'),
      time = []
require('moment-duration-format')
module.exports = class EvalCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'eval',
            group: 'util',
            memberName: 'eval',
            aliases: ["ev", "e", "eva", "code", "evalcode", "evaluate"],
            description: 'Executes JavaScript code.',
            details: 'Only the bot owner(s) may use this command.',
            hidden: true,
            guarded: true,
            ownerOnly: true,
            args: [
                {
                    key: 'script',
                    prompt: 'What code would you like to evaluate?',
                    type: 'string'
                },

            ]
        });

        this.lastResult = null;
    }

    async run(msg, {script}) {
        let bot = this.client, 
            client = this.client, 
            m = msg, 
            message = m, 
            c = m.channel, 
            color = msg.guild ? msg.guild.me.displayHexColor === "#000000" ? 0xFFBF00 : msg.guild.me.displayColor : 0xFFBF00,
	        dm = (id, msgs) => {
	            if(!id || !msgs) return message.channel.send(`Well provide an id and message..`);
	            let us = bot.users.cache.get(id)
	            if(!us) return message.channel.send(`User not found.. ***Sad ${bot.user.username} noise***`);
	            us.send(msgs).catch(err => {
	            return message.channel.send(`I couldn't dm the user.. ***Sad ${bot.user.username} noise***`)
	            })
	        }
        const doReply = val => {
            if (val instanceof Error) {
                return msg.channel.send({embed: {
                    author: {
                        name: this.client.user.tag,
                        icon_url: this.client.user.displayAvatarURL({dynamic: true})
                    },
                    timestamp: new Date(),
                    color: color,
                    description: val ? val :"undefined",
                    title: `[Callback] - Error`
                }});
            } else {
                const result = this.makeResultMessages(val, process.hrtime(this.hrStart));
                if (Array.isArray(result)) {
                    for (const item of result) {
                        if (this.client.options.selfbot) msg.channel.send(item); else msg.channel.send(item);
                    }
                } else if (this.client.options.selfbot) {
                    msg.channel.send(result);
                } else {
                    msg.channel.send(result);
                }
            }
        };
        let hrDiff;
        try {
            const hrStart = process.hrtime();
            this.lastResult = eval(script);
            hrDiff = process.hrtime(hrStart);
        } catch (err) {
            return msg.channel.send({embed: {
                author: {
                    name: this.client.user.tag,
                    icon_url: this.client.user.displayAvatarURL({dynamic: true})
                },
                timestamp: new Date(),
                color: 0xFF0000,
                description: err.message ? err.message : "undefined",
                title: `[Script] - Error`
            }});
        }

        // Prepare for callback time and respond
        this.hrStart = process.hrtime();
        let response = this.makeResultMessages(this.lastResult, hrDiff, script, msg.editable);
        if (msg.editable) {
            if (response instanceof Array) {
                if (response.length > 0) response = response.slice(1, response.length - 1);
                for (const re of response) msg.channel.send(re);
                return null;
            } else {
                return msg.channel.send({embed: {
                    author: {
                        name: this.client.user.tag,
                        icon_url: this.client.user.displayAvatarURL({dynamic: true})
                    },
                    timestamp: new Date(),
                    color: color,
                    title: `Result`,
                    description: response,
                    footer: {
                        text: `Executed in: ${time[0]}`
                    }
                }});
            }
        }else{
            return msg.channel.send({embed: {
                author: {
                    name: this.client.user.tag,
                    icon_url: this.client.user.displayAvatarURL({dynamic: true})
                },
                timestamp: new Date(),
                color: color,
                title: `Result`,
                description: response,
                footer: {
                    text: `Executed in: ${time[0]}`
                }
            }});
        }
    }

    makeResultMessages(result, hrDiff, input = null, editable = false) {
        const inspected = util.inspect(result, { depth: 0 }).replace(new RegExp('!!NL!!', 'g'), '\n').replace(this.sensitivePattern, 'no u');
		if(input) {
			if(hrDiff){
			time.push(`${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.`)
			}
			return `${editable ? `\`\`\`js\n${input}\`\`\`` : ''}
			\`\`\`js\n${inspected}\`\`\``;
		} else {
			if(hrDiff){
			time.push(`${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.`)
			}
			return `\`\`\`js\n${inspected}\`\`\``;
		}
    }

    get sensitivePattern() {
        if (!this._sensitivePattern) {
            let pattern = '';
            if (this.client.token) pattern += escapeRegex(this.client.token)
            Object.defineProperty(this, '_sensitivePattern', { value: new RegExp(pattern, 'gi') });
        }
        return this._sensitivePattern;
    }

};