"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlashCommand_1 = require("../../structures/SlashCommand");
const profile = require('./subcommands/profile');
const mostPlayed = require('./subcommands/mostPlayed');
exports.default = new SlashCommand_1.SlashCommand({
    name: "paladins",
    description: "Paladins infos (PC players only).",
    options: [
        {
            "name": "profile",
            "description": "Get user profile",
            "type": 1,
            "options": profile.default.options
        }
    ],
    run: async ({ interaction }) => {
        // check which subcommand was used
        if ((interaction as ExtendedInteraction).options.getSubcommand() === 'profile') {
            await profile.default.run({ interaction });
        }
    }
});
