import type {
	ApplicationCommandOptionData,
	BooleanCache,
	CacheType,
	InteractionResponse,
	Message,
	ApplicationCommandSubCommandData,
} from 'discord.js';
import type { RunOptions, SlashCommandType, SubCommandType } from '../typings/SlashCommand';

export class SubCommand implements SubCommandType {
	public name: string;

	public description: string;

	public options?: ApplicationCommandOptionData[];

	public run: (
		options: RunOptions,
	) => Promise<InteractionResponse<boolean> | Message<BooleanCache<CacheType>> | void>;

	public constructor(subCommandOptions: SubCommandType) {
		this.name = subCommandOptions.name;
		this.description = subCommandOptions.description;
		this.options = subCommandOptions.options ?? [];
		this.run = subCommandOptions.run;
	}
}

export class SlashCommand implements SlashCommandType {
	public name: string;

	public description: string;

	public options?: ApplicationCommandOptionData[] | ApplicationCommandSubCommandData[];

	public subcommands?: SubCommandType[];

	public run: (
		options: RunOptions,
	) => Promise<InteractionResponse<boolean> | Message<BooleanCache<CacheType>> | void>;

	public constructor(slashCommandOptions: SlashCommandType) {
		this.name = slashCommandOptions.name;
		this.description = slashCommandOptions.description;
		this.options = slashCommandOptions.options ?? [];
		this.subcommands = slashCommandOptions.subcommands ?? [];
		this.run = slashCommandOptions.run;
		console.log(`Slash command ${this.name} loaded`);
	}
}
