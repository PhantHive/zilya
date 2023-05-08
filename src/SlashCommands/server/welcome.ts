import {SlashCommand} from "../../structures/SlashCommand";
import {ExtendedInteraction} from "../../typings/SlashCommand";
const configureWelcomeCommand = require("./subcommands/welcome/welcomeConfig");
const removeWelcomeCommand = require("./subcommands/welcome/welcomeRemove");
// const editWelcomeCommand = require("./subcommands/welcome/welcomeEdit");

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
            "description": "Remove welcome message for the server",
            "type": 1,
            "options": removeWelcomeCommand.default.options
        }
    ],
    run: async ({interaction}) => {
        // check which subcommand was used
        if ((interaction as ExtendedInteraction).options.getSubcommand() === 'configure') {
            await configureWelcomeCommand.default.run({interaction});
        }
        if ((interaction as ExtendedInteraction).options.getSubcommand() === 'remove') {
            await removeWelcomeCommand.default.run({interaction});
        }
        // if ((interaction as ExtendedInteraction).options.getSubcommand() === 'edit') {
        //     await editWelcomeCommand.default.run({interaction});
        // }
    }
});

