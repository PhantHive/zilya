import { SlashCommand } from '../../structures/SlashCommand';
import { ExtendedInteraction } from '../../typings/SlashCommand';
import { configureWelcomeCommand } from './subcommands/welcome/welcomeConfig';
import { removeWelcomeCommand } from './subcommands/welcome/welcomeRemove';
import { editWelcomeCommand } from './subcommands/welcome/welcomeEdit';

// create logger command that will have 2 subcommands
const welcomeCommand = new SlashCommand({
    name: 'welcome',
    description: 'Configure welcome message for the server',
    options: [
        {
            name: 'configure',
            description: 'Configure welcome message for the server',
            type: 1,
            options: configureWelcomeCommand.options,
        },
        {
            name: 'remove',
            description: 'Remove welcome message for the server',
            type: 1,
            options: removeWelcomeCommand.options,
        },
        {
            name: 'edit',
            description: 'Edit welcome message for the server',
            type: 1,
            options: editWelcomeCommand.options,
        },
    ],
    userPermissions: ['Administrator'],
    subcommands: [configureWelcomeCommand, removeWelcomeCommand, editWelcomeCommand],
    run: async ({ interaction }) => {
        await interaction.deferReply();
        let subcommand;

        if ('options' in interaction) {
            const subcommandName = interaction.options.getSubcommand();
            subcommand = welcomeCommand.subcommands.find(cmd => cmd.name === subcommandName);
        }
        if (subcommand) {
            await subcommand.run({ interaction });
        } else {
            await interaction.reply('Subcommand not found!');
        }
    },
});

export default welcomeCommand;