import { ExtendedClient } from '../structures/Client';
import {
    CommandInteraction, CommandInteractionOptionResolver,
    PermissionResolvable, ChatInputApplicationCommandData, GuildMember, AnyComponentBuilder, ActionRowBuilder
} from 'discord.js';

/**
* {
* "name": "commandName,
* "description": "any desc"
* "run: async ({ interaction }) => {
* }
* }
*/

export interface ExtendedInteraction extends CommandInteraction {
    member: GuildMember;
    customId?: string;
    async

    update(options: any): Promise<any>;
}


interface RunOptions {
    client: ExtendedClient,
    interaction: ExtendedInteraction,
    args: CommandInteractionOptionResolver
}

type RunFunction = ( options: RunOptions ) => any;

export type CommandType = {
    userPermissions?: PermissionResolvable[];
    run: RunFunction;

} & ChatInputApplicationCommandData;