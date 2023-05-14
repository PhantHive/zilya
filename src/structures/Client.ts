// @ts-ignore
import {
    ApplicationCommandDataResolvable,
    Client,
    Collection,
    ClientEvents
} from 'discord.js';
import { CommandType } from "../typings/SlashCommand";
import glob from 'glob';
import { RegisterCommandsOptions } from "../typings/client";
import { Event } from "./Event"


export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection();
    lastMessageTimestamp: number;

    constructor() {
        super({ intents: ['Guilds', 'GuildMessages', 'GuildMembers', 'GuildMessageReactions', 'MessageContent', 'DirectMessages',
            'GuildVoiceStates'] });
    }

    start() {
        this.registerModules()
        this.login(process.env.BOT_TOKEN);
    }

    async importFiles(filePath: string) {
        console.log(filePath);
        const file = await import(filePath);
        return file?.default;
    }

    async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
        if (guildId) {
            await this.guilds.cache.get(guildId)?.commands.set(commands);
        } else {
            await this.application?.commands.set(commands);
        }
    }

    async registerModules() {
        // Commands global
        const slashCommands: ApplicationCommandDataResolvable[] = [];
        const phearionSlashCommands: ApplicationCommandDataResolvable[] = [];

        // get list of all ts and js file within subfolder of SlashCommands
        const commandFiles = glob.sync(`${__dirname}/../SlashCommands/*/*{.ts,.js}`.replace(/\\/g, '/'));
        // keep only commands within Phearion folder (global commands only here)
        const filteredCommandFiles = commandFiles.filter((file) => file.includes('phearion'));

        // in slashCommands, filter out Phearion commands
        const filteredGlobalFiles = commandFiles.filter((file) => !file.includes('phearion'));


        console.log('Phearion commands: ', filteredCommandFiles);

        // register global commands
        let c = 1;
        for (const filePath of filteredGlobalFiles) {
            const command: CommandType = await this.importFiles(filePath);
            if (!command.name) continue;
            this.commands.set(command.name, command);
            slashCommands.push(command);
            c++;
        }

        // register Phearion guild commands
        for (const filePath of filteredCommandFiles) {
            const command: CommandType = await this.importFiles(filePath);
            if (!command.name) continue;
            this.commands.set(command.name, command);
            phearionSlashCommands.push(command);
            c++;
        }


        this.on('ready', () => {
            this.registerCommands({
                commands: slashCommands,
                guildId: null
            });
            this.registerCommands({
                commands: phearionSlashCommands,
                guildId: process.env.GUILD_ID
            });
        })


        // Event
        const eventFiles = glob.sync(`${__dirname}/../events/*/*{.ts,.js}`.replace(/\\/g, '/'));
        c = 1;
        for (const filePath of eventFiles) {
            const event: Event<keyof ClientEvents> = await this.importFiles(filePath);
            this.on(event.event, event.run);
            c++;
        }

    }
}