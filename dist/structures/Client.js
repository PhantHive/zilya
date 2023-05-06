"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedClient = void 0;
const tslib_1 = require("tslib");
// @ts-ignore
const discord_js_1 = require("discord.js");
const glob_1 = tslib_1.__importDefault(require("glob"));
class ExtendedClient extends discord_js_1.Client {
    commands = new discord_js_1.Collection();
    constructor() {
        super({ intents: ['Guilds', 'GuildMessages', 'GuildMembers', 'GuildMessageReactions', 'MessageContent', 'DirectMessages',
                'GuildVoiceStates'] });
    }
    start() {
        this.registerModules();
        this.login(process.env.BOT_TOKEN);
    }
    async importFiles(filePath) {
        var _a;
        console.log(filePath);
        const file = await (_a = filePath, Promise.resolve().then(() => tslib_1.__importStar(require(_a))));
        return file?.default;
    }
    async registerCommands({ commands, guildId }) {
        if (guildId) {
            await this.guilds.cache.get(guildId)?.commands.set(commands);
        }
        else {
            await this.application?.commands.set(commands);
        }
    }
    async registerModules() {
        // Commands global
        const slashCommands = [];
        const phearionSlashCommands = [];
        // get list of all ts and js file within subfolder of SlashCommands
        const commandFiles = glob_1.default.sync(`${__dirname}/../SlashCommands/*/*{.ts,.js}`.replace(/\\/g, '/'));
        // keep only commands within Phearion folder (global commands only here)
        const filteredCommandFiles = commandFiles.filter((file) => file.includes('phearion'));
        // in slashCommands, filter out Phearion commands
        const filteredGlobalFiles = commandFiles.filter((file) => !file.includes('phearion'));
        console.log('Phearion commands: ', filteredCommandFiles);
        // register global commands
        let c = 1;
        for (const filePath of filteredGlobalFiles) {
            const command = await this.importFiles(filePath);
            if (!command.name)
                continue;
            this.commands.set(command.name, command);
            slashCommands.push(command);
            c++;
        }
        // register Phearion guild commands
        for (const filePath of filteredCommandFiles) {
            const command = await this.importFiles(filePath);
            if (!command.name)
                continue;
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
        });
        // Event
        const eventFiles = glob_1.default.sync(`${__dirname}/../events/*/*{.ts,.js}`.replace(/\\/g, '/'));
        c = 1;
        for (const filePath of eventFiles) {
            const event = await this.importFiles(filePath);
            this.on(event.event, event.run);
            c++;
        }
    }
}
exports.ExtendedClient = ExtendedClient;
