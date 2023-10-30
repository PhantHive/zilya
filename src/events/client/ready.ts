import { ActivityType } from 'discord.js';
import { Event } from '../../structures/Event';

export default new Event('ready', async (client) => {
	console.log(`Logged in as ${client.user?.tag}!`);
	if (!client.user) return;
	client.user.setPresence({
		activities: [{ name: 'PHEARION NETWORK', type: ActivityType.Competing }],
		status: 'dnd',
	});
});
