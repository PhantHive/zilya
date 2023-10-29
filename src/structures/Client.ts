import { dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { ApplicationCommandDataResolvable, ClientEvents } from 'discord.js';
import { Client, Collection } from 'discord.js';
import * as glob from 'glob';
import type { SlashCommandType } from '../typings/SlashCommand';
import type { RegisterCommandsOptions } from '../typings/client';
import type { Event } from './Event';

export class ExtendedClient extends Client {
	public commands: Collection<string, SlashCommandType> = new Collection();

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
		const fileURL = pathToFileURL(filePath);
		const file = await import(fileURL.href);
		return file?.default;
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

		// get list of all ts and js file within subfolder of SlashCommands
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = dirname(__filename);
		const commandFiles = glob.sync(
			`${__dirname}/../SlashCommands/*/*{.ts,.js}`.replaceAll('\\', '/'),
		);

		// register global commands
		let count = 1;
		for (const filePath of commandFiles) {
			try {
				const command: SlashCommandType | undefined = await this.importFiles(filePath);
				if (!command || !command.name) {
					console.error(`Command not found or invalid command structure in file: ${filePath}`);
					continue;
				}

				this.commands.set(command.name, command);
				slashCommands.push(command as ApplicationCommandDataResolvable);
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
		});

		// Event
		const eventFiles = glob.sync(`${__dirname}/../events/*/*{.ts,.js}`.replaceAll('\\', '/'));
		count = 1;
		for (const filePath of eventFiles) {
			const event: Event<keyof ClientEvents> = await this.importFiles(filePath);
			this.on(event.event, event.run);
			count++;
		}
	}
}
