import WelcomeModel from '../../../../assets/utils/models/Welcome';
import { SubCommand } from '../../../../structures/SlashCommand';
import type { IWelcomeDocument } from '../../../../typings/MongoTypes';
import type { ExtendedSelectMenuInteraction } from '../../../../typings/SlashCommand';
import { nextStep } from './src/setter/setCustom';

export const configureWelcomeCommand = new SubCommand({
	name: 'configure',
	description: 'Configure welcome message for the server',
	options: [],
	run: async ({ interaction }) => {
		if (!interaction.guild) return interaction.reply('This command can only be used in a server.');
		let data = await WelcomeModel.findOne<IWelcomeDocument>({
			serverId: `${interaction.guild.id}`,
		});

		if (!data) {
			await new WelcomeModel({
				serverId: `${interaction.guild.id}`,
				channelId: '0',
				theme: -1,
				isEdit: false,
				color: '#000000',
			}).save();

			data = await WelcomeModel.findOne<IWelcomeDocument>({
				serverId: `${interaction.guild.id}`,
			});

			if (!data)
				return interaction.reply({
					content: 'Error trying to configure welcome message.',
					ephemeral: true,
				});
			await nextStep(data, interaction as ExtendedSelectMenuInteraction);
		} else {
			await nextStep(data, interaction as ExtendedSelectMenuInteraction);
		}
	},
});
