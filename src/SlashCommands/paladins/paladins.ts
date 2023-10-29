import { SlashCommand } from '../../structures/SlashCommand';
import { profileSubCommand } from './subcommands/paladins/profile';

const paladinsCommand = new SlashCommand({
	name: 'paladins',
	description: 'Paladins infos (PC players only).',
	options: [
		{
			type: 1, // 1 is for sub command
			name: 'profile',
			description: 'Get paladins profile infos',
			options: [
				{
					name: 'nickname',
					description: 'User nickname',
					type: 3,
					required: true,
				},
			],
		},
	],
	subcommands: [profileSubCommand],
	run: async ({ interaction }) => {
		await interaction.deferReply();
		let subcommand;

		if ('options' in interaction) {
			const subcommandName = interaction.options.getSubcommand();
			subcommand = paladinsCommand.subcommands?.find((cmd) => cmd.name === subcommandName);
		}

		if (subcommand) {
			await subcommand.run({ interaction });
		} else {
			await interaction.reply('Subcommand not found!');
		}
	},
});

export default paladinsCommand;
