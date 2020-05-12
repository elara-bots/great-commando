# This is a modified version of discord.js-commando and has a few more features than the normal commando.




## About
Commando is the official command framework for [discord.js](https://github.com/discordjs/discord.js).
It is flexible, fully object-oriented, easy to use, and makes it trivial to create your own powerful commands.
Additionally, it makes full use of ES2017's `async`/`await` functionality for clear, concise code that is simple to write and easy to comprehend.

## Normal Commando Features
- Plain command names and aliases
- Regular expression triggers
- Robust parsing of arguments (with "quoted strings" support)
- Sophisticated argument system (optional)
	* Automatic prompting for arguments that aren't provided
	* Type system with rules, automatic validation, and parsing to usable values
		- Basic types (string, integer, float, boolean)
		- Discord objects (user, member, role, channel, message)
		- User-defined custom types
		- Union types
	* Automatic re-prompting of invalid arguments
	* Optional arguments with default values
	* Infinite arguments (arguments that accept as many values as provided)
- Multiple responses to commands
- Command editing (user edits their message that triggered the command, and the bot's response updates with it)
- Command reloading, as well as loading/unloading
- Command throttling/cooldowns


# Great-Commando features
- RichDisplay, RichMenu reaction pages
- Command prompts embedded
- Removed: `load, unload, reload` (never worked)
- Added: `client.send(message, "Your content here")` as a short way to send embeds to the channel.
- Added: `duration` to the types to use.
- Added: `dmOnly` to the command constructor, for commands that require to be used in DMs only.
- Fixed: `filterArray` deprecation issue.
- Updated: `help` to not spam your dms and use a the RichDisplay reaction page. 😎

## Installation
**Node 8.0.0 or newer is required.**  
`npm install great-commando`

## Documentation
[View the docs here.](https://discord.js.org/#/docs/commando)  
See the [discord.js documentation](https://discord.js.org/#/docs) as well.
