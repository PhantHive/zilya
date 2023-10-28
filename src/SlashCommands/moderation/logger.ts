import { SlashCommand } from '../../structures/SlashCommand';
import { ExtendedInteraction } from '../../typings/SlashCommand';
import { configureLoggerCommand } from './subcommands/logger/loggerConfig';
import { removeLoggerCommand } from './subcommands/logger/loggerRemove';

// create logger command that will have 2 subcommands
export const logger = new SlashCommand({
    name: 'logger',
    description: 'Configure logger for the server',
    userPermissions: ['Administrator'],
    run: async ({ interaction }) => {
        await interaction.deferReply();
        let subcommand;

        if ('options' in interaction) {
            const subcommandName = interaction.options.getSubcommand();
            subcommand = logger.subcommands.find(cmd => cmd.name === subcommandName);
        }
        if (subcommand) {
            await subcommand.run({ interaction });
        } else {
            await interaction.reply('Subcommand not found!');
        }
    },
});
