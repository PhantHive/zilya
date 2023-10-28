import { SlashCommand } from '../../structures/SlashCommand';
import { ExtendedInteraction } from '../../typings/SlashCommand';

import { dailySubCommand } from './subcommands/phearion/daily';
import { moneySubCommand } from './subcommands/phearion/money';
import { pheabankSubCommand } from './subcommands/phearion/pheabank';
import { pheareaSubCommand } from './subcommands/phearion/phearea';

const phearionCommand = new SlashCommand({
    name: 'phearion',
    description: 'All Phearion commands',
    options: [
        {
            name: 'daily',
            description: 'Get your daily reward',
            type: 1,
            options: dailySubCommand.options,
        },
        {
            name: 'money',
            description: 'Check your money',
            type: 1,
            options: moneySubCommand.options,
        },
        {
            name: 'pheabank',
            description: 'Check your pheabank',
            type: 1,
            options: pheabankSubCommand.options,
        },
        {
            name: 'phearea',
            description: 'Check your phearea',
            type: 1,
            options: pheareaSubCommand.options,
        },
    ],
    run: async ({ interaction }) => {
        await interaction.deferReply();
        let subcommand;

        if ('options' in interaction) {
            const subcommandName = interaction.options.getSubcommand();
            subcommand = phearionCommand.subcommands.find(cmd => cmd.name === subcommandName);
        }
        if (subcommand) {
            await subcommand.run({ interaction });
        } else {
            await interaction.reply('Subcommand not found!');
        }
    },
});

export default phearionCommand;
