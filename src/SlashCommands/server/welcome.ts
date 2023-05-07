import {SlashCommand} from "../../structures/SlashCommand";
const configureWelcomeCommand = require("./subcommands/welcome/welcomeConfig");
const removeWelcomeCommand = require("./subcommands/welcome/welcomeRemove");
const editWelcomeCommand = require("./subcommands/welcome/welcomeEdit");

// create logger command that will have 2 subcommands
exports.default = new SlashCommand({
    name: 'welcome',
    description: 'Configure welcome message for the server',
    options: [
        {
            "name": "configure",
            "description": "Configure welcome message for the server",
            "type": 1,
            "options": configureWelcomeCommand.default.options
        },
        {
            "name": "remove",
            "description": "Remove welcome message  for the server",
            "type": 1,
            "options": removeWelcomeCommand.default.options
        },
        {
            "name": "edit",
            "description": "Edit welcome message  for the server",
            "type": 1,
            "options": editWelcomeCommand.default.options
        }
    ],
    run: async ({interaction}) => {
        // check which subcommand was used
        if (interaction.options.getSubcommand() === 'configure') {
            await configureWelcomeCommand.default.run({interaction});
        }
        if (interaction.options.getSubcommand() === 'remove') {
            await removeWelcomeCommand.default.run({interaction});
        }
        if (interaction.options.getSubcommand() === 'edit') {
            await editWelcomeCommand.default.run({interaction});
        }
    }
});

