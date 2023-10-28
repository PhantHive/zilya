import { ExtendedInteraction } from '../../typings/SlashCommand';

import { hugSubCommand } from './action/subcommands/actions/hug';
import { objectionSubCommand } from './action/subcommands/actions/objection';
import { SlashCommand } from '../../structures/SlashCommand';

const actionCommand = new SlashCommand({
    name: 'action',
    description: 'Action commands',
    options: [
        {
            type: 1, // 1 is for sub command
            name: 'hug',
            description: 'Hug someone',
            options: hugSubCommand.options,
        },
        {
            type: 1, // 1 is for sub command
            name: 'objection',
            description: 'Objection someone',
        }
    ],
    subcommands: [hugSubCommand, objectionSubCommand],
    run: async ({ interaction }) => {
        let subcommand;

        if ('options' in interaction) {
            const subcommandName = interaction.options.getSubcommand();
            subcommand = actionCommand.subcommands.find(cmd => cmd.name === subcommandName);
        }
        if (subcommand) {
            await subcommand.run({ interaction });
        } else {
            await interaction.reply('Subcommand not found!');
        }
    }
});

export default actionCommand;