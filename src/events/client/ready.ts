import { ActivityType } from 'discord.js';
import { client } from '../../index';
import { Event } from '../../structures/Event';

export default new Event('ready', () => {
	console.log(`Logged in as ${client.user?.tag}!`);
	if (!client.user) return;
	client.user.setPresence({
		activities: [{ name: 'PHEARION NETWORK', type: ActivityType.Competing }],
		status: 'dnd',
	});
});
