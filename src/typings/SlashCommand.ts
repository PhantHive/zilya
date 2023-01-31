import { ExtendedClient } from '../structures/Client';
import {
    CommandInteraction,
    CommandInteractionOptionResolver,
    PermissionResolvable,
    ChatInputApplicationCommandData,
    GuildMember,
    AnyComponentBuilder,
    ActionRowBuilder,
    EmbedBuilder
} from 'discord.js';


export interface ExtendedInteraction extends CommandInteraction {
    member: GuildMember;
    customId?: string;

    options: CommandInteractionOptionResolver & {
        getSubcommand(): string;
        get(name: string, required?: boolean): any;
    }

    // configure the type of the options property
    update(options: {
        content?: string | null;
        embeds?: EmbedBuilder[] | null;
        components?: (AnyComponentBuilder | ActionRowBuilder)[] | null;
    }): Promise<ExtendedInteraction>;

}

export interface RunOptions {
    client: ExtendedClient,
    interaction: ExtendedInteraction,
    args: CommandInteractionOptionResolver

}

type RunFunction = (options: RunOptions) => any;

export type CommandType = {
    userPermissions?: PermissionResolvable[];
    run: RunFunction;

} & ChatInputApplicationCommandData;