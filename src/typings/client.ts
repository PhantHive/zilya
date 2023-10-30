import type { ApplicationCommandDataResolvable } from 'discord.js';

export interface RegisterCommandsOptions {
	commands: ApplicationCommandDataResolvable[];
	guildId?: string;
	subcommands?: ApplicationCommandDataResolvable[];
}
