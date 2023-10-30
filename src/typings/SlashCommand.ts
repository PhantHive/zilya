import type {
	SelectMenuInteraction,
	CommandInteraction,
	CommandInteractionOptionResolver,
	PermissionResolvable,
	ChatInputApplicationCommandData,
	GuildMember,
	AnyComponentBuilder,
	ActionRowBuilder,
	EmbedBuilder,
	BufferResolvable,
	AttachmentData,
	ApplicationCommandOptionData,
	CacheType,
	BooleanCache,
	Message,
	InteractionResponse,
	ApplicationCommandSubCommandData,
} from 'discord.js';
import type { ExtendedClient } from '../structures/Client';

export interface ExtendedInteraction extends CommandInteraction {
	customId?: string;
	member: GuildMember;

	options: CommandInteractionOptionResolver & {
		get(name: string, required?: boolean): CommandInteractionOptionResolver;
		getSubcommand(): string;
	};

	// configure the type of the options property
	update(options: {
		components?: (ActionRowBuilder | AnyComponentBuilder)[] | null;
		content?: string | null;
		embeds?: EmbedBuilder[] | null;
	}): Promise<ExtendedInteraction>;
}

export interface ExtendedSelectMenuInteraction extends SelectMenuInteraction {
	customId: string;
	values: string[];
}

export interface MyAttachmentData extends AttachmentData {
	attachment: BufferResolvable;
	name?: string;
}

export interface RunOptions {
	_args?: CommandInteractionOptionResolver;
	_client?: ExtendedClient;
	interaction: ExtendedInteraction | ExtendedSelectMenuInteraction;
}

type RunFunction = (
	options: RunOptions,
) => Promise<InteractionResponse | Message<BooleanCache<CacheType>> | void>;

export type SubCommandType = Omit<ChatInputApplicationCommandData, 'type'> & {
	description: string;
	name: string;
	options?: ApplicationCommandOptionData[] | undefined;
	run: RunFunction;
};

export type SlashCommandType = Omit<ChatInputApplicationCommandData, 'type'> & {
	options?: ApplicationCommandOptionData[] | ApplicationCommandSubCommandData[] | undefined;
	run: RunFunction;
	subcommands?: SubCommandType[];
	userPermissions?: PermissionResolvable[];
};
