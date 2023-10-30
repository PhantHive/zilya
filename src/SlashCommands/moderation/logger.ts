import type { ApplicationCommandSubCommandData } from 'discord.js';
import { SlashCommand } from '../../structures/SlashCommand';
import { configureLoggerCommand } from './subcommands/logger/loggerConfig';
import { removeLoggerCommand } from './subcommands/logger/loggerRemove';

// create logger command that will have 2 subcommands
const loggerCommand = new SlashCommand({
	name: 'logger',
	description: 'Configure logger for the server',
	options: [
		{
			type: 1, // 1 is for sub command
			name: 'config',
			description: 'Configure logger',
			options: configureLoggerCommand.options ?? [],
		},
		{
			type: 1, // 1 is for sub command
			name: 'remove',
			description: 'Remove logger',
		},
	] as ApplicationCommandSubCommandData[],
	userPermissions: ['Administrator'],
	subcommands: [configureLoggerCommand, removeLoggerCommand],
	run: async ({ interaction }) => {
		let subcommand;

		if ('options' in interaction) {
			const subcommandName = interaction.options.getSubcommand();
			subcommand = loggerCommand.subcommands?.find((cmd) => cmd.name === subcommandName);
		}

		if (subcommand) {
			await subcommand.run({ interaction });
		} else {
			await interaction.reply('Subcommand not found!');
		}
	},
});

export default loggerCommand;
