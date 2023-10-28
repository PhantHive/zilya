import { SlashCommand } from '../../structures/SlashCommand';

import { profileSubCommand } from './subcommands/paladins/profile';

export const paladinsCommand = new SlashCommand({
    name: 'paladins',
    description: 'Paladins infos (PC players only).',
    options: undefined,
    subcommands: [profileSubCommand],
    run: async ({ interaction }) => {
        await interaction.deferReply();
        let subcommand;

        if ('options' in interaction) {
            const subcommandName = interaction.options.getSubcommand();
            subcommand = paladinsCommand.subcommands.find(cmd => cmd.name === subcommandName);
        }
        if (subcommand) {
            await subcommand.run({ interaction });
        } else {
            await interaction.reply('Subcommand not found!');
        }
    },
});
