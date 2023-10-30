import type { ClientEvents } from 'discord.js';
import { ExtendedClient } from './Client'; // Import your ExtendedClient

export class Event<K extends keyof ClientEvents> {
	public name: K;
	public run: (client: ExtendedClient, ...args: ClientEvents[K]) => Promise<void>;

	public constructor(name: K, run: (client: ExtendedClient, ...args: ClientEvents[K]) => Promise<void>) {
		this.name = name;
		this.run = run;
	}
}
