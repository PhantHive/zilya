import { client } from '..';
import { Event } from "../structures/Event";
import { ActivityType } from "discord.js";

export default new Event ('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    client.user.setPresence({
        activities: [{ name: 'PHEARION NETWORK',  type: ActivityType.Competing }],
        status: 'dnd'
    });
});

