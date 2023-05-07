"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlashCommand_1 = require("../../structures/SlashCommand");
const daily = require('./subcommands/phearion/daily');
const money = require('./subcommands/phearion/money');
const pheabank = require('./subcommands/phearion/pheabank');
const phearea = require('./subcommands/phearion/phearea');
exports.default = new SlashCommand_1.SlashCommand({
    name: 'phearion',
    description: 'All Phearion commands',
    options: [
        {
            "name": "daily",
            "description": "Get your daily reward",
            "type": 1,
            "options": daily.default.options
        },
        {
            "name": "money",
            "description": "Check your money",
            "type": 1,
            "options": money.default.options
        },
        {
            "name": "pheabank",
            "description": "Check your pheabank",
            "type": 1,
            "options": pheabank.default.options
        },
        {
            "name": "phearea",
            "description": "Check your phearea",
            "type": 1,
            "options": phearea.default.options
        }
    ],
    run: async ({ interaction }) => {
        // check which subcommand was used
        if ((interaction as ExtendedInteraction).options.getSubcommand() === 'daily') {
            await daily.default.run({ interaction });
        }
        if ((interaction as ExtendedInteraction).options.getSubcommand() === 'money') {
            await money.default.run({ interaction });
        }
        if ((interaction as ExtendedInteraction).options.getSubcommand() === 'pheabank') {
            await pheabank.default.run({ interaction });
        }
        if ((interaction as ExtendedInteraction).options.getSubcommand() === 'phearea') {
            await phearea.default.run({ interaction });
        }
    }
});
