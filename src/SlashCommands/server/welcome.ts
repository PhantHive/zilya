import { SlashCommand } from '../../structures/SlashCommand';
import { configureWelcomeCommand } from './subcommands/welcome/welcomeConfig';
import { editWelcomeCommand } from './subcommands/welcome/welcomeEdit';
import { removeWelcomeCommand } from './subcommands/welcome/welcomeRemove';

// create logger command that will have 2 subcommands
const welcomeCommand = new SlashCommand({
	name: 'welcome',
	description: 'Configure welcome message for the server',
	options: [
		{
			name: 'configure',
			description: 'Configure welcome message for the server',
			type: 1,
		},
		{
			name: 'remove',
			description: 'Remove welcome message for the server',
			type: 1,
		},
		{
			name: 'edit',
			description: 'Edit welcome message for the server',
			type: 1,
		},
	],
	userPermissions: ['Administrator'],
	subcommands: [configureWelcomeCommand, removeWelcomeCommand, editWelcomeCommand],
	run: async ({ interaction }) => {
		await interaction.deferReply();
		let subcommand;

		if ('options' in interaction) {
			const subcommandName = interaction.options.getSubcommand();
			subcommand = welcomeCommand.subcommands?.find((cmd) => cmd.name === subcommandName);
		}

		if (subcommand) {
			await subcommand.run({ interaction });
		} else {
			await interaction.reply('Subcommand not found!');
		}
	},
});

export default welcomeCommand;
