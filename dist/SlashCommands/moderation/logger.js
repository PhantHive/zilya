"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlashCommand_1 = require("../../structures/SlashCommand");
const configureLoggerCommand = require("./subcommands/logger/loggerConfig");
const removeLoggerCommand = require("./subcommands/logger/loggerRemove");
// create logger command that will have 2 subcommands
exports.default = new SlashCommand_1.SlashCommand({
    name: 'logger',
    description: 'Configure logger for the server',
    options: [
        {
            "name": "configure",
            "description": "Configure logger for the server",
            "type": 1,
            "options": configureLoggerCommand.default.options
        },
        {
            "name": "remove",
            "description": "Remove logger for the server",
            "type": 1,
            "options": removeLoggerCommand.default.options
        }
    ],
    run: async ({ interaction }) => {
        // check which subcommand was used
        if ((interaction as ExtendedInteraction).options.getSubcommand() === 'configure') {
            await configureLoggerCommand.default.run({ interaction });
        }
        if ((interaction as ExtendedInteraction).options.getSubcommand() === 'remove') {
            await removeLoggerCommand.default.run({ interaction });
        }
    }
});
