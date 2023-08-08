import { ExtendedClient } from '../structures/Client';
import {
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
} from 'discord.js';

export interface ExtendedInteraction extends CommandInteraction {
    member: GuildMember;
    customId?: string;

    options: CommandInteractionOptionResolver & {
        getSubcommand(): string;
        get(name: string, required?: boolean): any;
    };

    // configure the type of the options property
    update(options: {
        content?: string | null;
        embeds?: EmbedBuilder[] | null;
        components?: (AnyComponentBuilder | ActionRowBuilder)[] | null;
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
    client: ExtendedClient;
    interaction: ExtendedInteraction | ExtendedSelectMenuInteraction;
    args: CommandInteractionOptionResolver;
}

type RunFunction = (options: RunOptions) => any;

export type CommandType = {
    userPermissions?: PermissionResolvable[];
    run: RunFunction;
} & ChatInputApplicationCommandData;
