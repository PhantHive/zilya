import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { ApplicationCommandDataResolvable, ClientEvents } from 'discord.js';
import { Client, Collection } from 'discord.js';
import * as glob from 'glob';
import type { SlashCommandType } from '../typings/SlashCommand';
import type { RegisterCommandsOptions } from '../typings/client';
import type { Event } from './Event';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class ExtendedClient extends Client {
	public commands: Collection<string, SlashCommandType> = new Collection();

	public events: Collection<string, Event<keyof ClientEvents>> = new Collection();

	public lastMessageTimestamp: number | undefined;

	// public static superagent: typeof superagent;

	public constructor() {
		super({
			intents: [
				'Guilds',
				'GuildMessages',
				'GuildMembers',
				'GuildMessageReactions',
				'MessageContent',
				'DirectMessages',
				'GuildVoiceStates',
			],
		});
	}

	public async start() {
		await this.registerModules();
		await this.login(process.env.BOT_TOKEN);
	}

	public async importFiles(filePath: string) {
		try {
			const fileURL = pathToFileURL(filePath);
			const file = await import(fileURL.href);
			return file.default;
		} catch (error) {
			console.error(`Error importing file from path: ${filePath}`, error);
			return undefined;
		}
	}

	public async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
		if (guildId) {
			await this.guilds.cache.get(guildId)?.commands.set(commands);
		} else {
			await this.application?.commands.set(commands);
		}
	}

	public async registerModules() {
		// Commands global
		const slashCommands: ApplicationCommandDataResolvable[] = [];

		const commandFiles = glob.sync(
			join(__dirname, '../SlashCommands/*/*{.ts,.js}').replaceAll('\\', '/'),
		);

		// register global commands
		let count = 1;
		for (const filePath of commandFiles) {
			try {
				console.log(`Loading slash command from file: ${filePath}`);
				const command: SlashCommandType | undefined = await this.importFiles(filePath);
				if (!command || !command.name) {
					console.error(`Command not found or invalid command structure in file: ${filePath}`);
					continue;
				}

				this.commands.set(command.name, command);
				slashCommands.push(command);
				count++;
			} catch (error) {
				console.error(`Error loading command from file: ${filePath}`, error);
			}
		}

		this.on('ready', async () => {
			await this.registerCommands({
				commands: slashCommands,
				guildId: '',
			});
			console.log(`Registered ${slashCommands.length} slash commands`);
		});

		// Events
		const eventFiles = glob.sync(join(__dirname, '../events/*/*{.ts,.js}').replaceAll('\\', '/'));
		for (const filePath of eventFiles) {
			try {
				console.log(`Loading event from file: ${filePath}`);
				const event: Event<keyof ClientEvents> | undefined = await this.importFiles(filePath);
				if (!event?.name) {
					console.error(`Event not found or invalid event structure in file: ${filePath}`);
					continue;
				}

				this.events.set(event.name, event);
				this.on(event.name, async (...args) => event.run(this, ...args));
			} catch (error) {
				console.error(`Error loading event from file: ${filePath}`, error);
			}
		}
	}
}
