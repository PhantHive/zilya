"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlashCommand_1 = require("../../structures/SlashCommand");
exports.default = new SlashCommand_1.SlashCommand({
    name: 'ping',
    description: 'Pong!',
    run: async ({ interaction }) => {
        await interaction.reply('Pong!');
    }
});
