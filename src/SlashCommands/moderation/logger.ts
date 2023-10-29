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
			options: [
				{
					name: 'channel_id',
					description: 'channel id',
					type: 7,
					required: true,
				},
				{
					name: 'notif',
					description: 'which notification you want',
					type: 3,
					choices: [
						{
							name: 'all',
							value: 'all',
						},
						{
							name: 'no voice logs',
							value: 'no_voice_logs',
						},
						{
							name: 'voice logs',
							value: 'only_voice_logs',
						},
					],
					required: true,
				},
				{
					name: 'color',
					description: 'Choose a color. By default: Yellow',
					type: 3,
					choices: [
						{
							name: 'Red',
							value: 'red',
						},
						{
							name: 'Blue',
							value: 'blue',
						},
						{
							name: 'Aqua',
							value: 'aqua',
						},
						{
							name: 'Green',
							value: 'green',
						},
						{
							name: 'Pink',
							value: 'luminous_vivid_pink',
						},
					],
				},
			],
		},
		{
			type: 1, // 1 is for sub command
			name: 'remove',
			description: 'Remove logger',
		},
	],
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
