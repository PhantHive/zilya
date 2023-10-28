import { SlashCommandType, RunOptions, SubCommandType } from '../typings/SlashCommand';
import {
    CommandInteraction,
    ChatInputApplicationCommandData,
    PermissionResolvable,
    ApplicationCommandSubCommandData,
} from 'discord.js';

export class SubCommand implements SubCommandType {
    name: string;
    description: string;
    options?: ApplicationCommandSubCommandData['options'];

    constructor(commandOptions: SubCommandType) {
        Object.assign(this, commandOptions);
    }

    run: (options: {
        interaction: any
    }) => Promise<void> = async ({ interaction }) => {};
}

export class SlashCommand implements SlashCommandType {
    name: string;
    description: string;
    options?: ChatInputApplicationCommandData['options'];
    subcommands?: SubCommand[];

    constructor(commandOptions: SlashCommandType) {
        Object.assign(this, commandOptions);
    }

    run: (options: RunOptions) => Promise<void> = async ({ interaction }) => {}


}
