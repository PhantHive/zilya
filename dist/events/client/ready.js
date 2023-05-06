"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
const Event_1 = require("../../structures/Event");
const discord_js_1 = require("discord.js");
exports.default = new Event_1.Event('ready', () => {
    console.log(`Logged in as ${index_1.client.user?.tag}!`);
    index_1.client.user.setPresence({
        activities: [{ name: 'PHEARION NETWORK', type: discord_js_1.ActivityType.Competing }],
        status: 'dnd'
    });
});
