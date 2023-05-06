"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hug = require('./subcommands/actions/hug');
const objection = require('./subcommands/actions/objection');
const SlashCommand_1 = require("../../structures/SlashCommand");
// create a group of commands with the name "action" and the description "Action commands"
// add a subcommand with the name "hug" and the description "Hug someone"
// add a subcommand with the name "kiss" and the description "Kiss someone"
// add a subcommand with the name "pat" and the description "Pat someone"
// add a subcommand with the name "slap" and the description "Slap someone"
// add a subcommand with the name "smug" and the description "Smug someone"
// add a subcommand with the name "tickle" and the description "Tickle someone"
// add a subcommand with the name "poke" and the description "Poke someone"
exports.default = new SlashCommand_1.SlashCommand({
    name: 'action',
    description: 'Action commands',
    options: [
        {
            "name": "hug",
            "description": "Hug someone",
            "type": 1,
            "options": hug.default.options
        },
        {
            "name": "objection",
            "description": "Objection!",
            "type": 1,
            "options": objection.default.options
        }
    ],
    run: async ({ interaction }) => {
        // check which subcommand was used
        if (interaction.options.getSubcommand() === 'hug') {
            await hug.default.run({ interaction });
        }
        else if (interaction.options.getSubcommand() === 'objection') {
            await objection.default.run({ interaction });
        }
    }
});
