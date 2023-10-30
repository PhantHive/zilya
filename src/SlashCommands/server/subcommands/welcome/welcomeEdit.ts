import { setTimeout as wait } from 'node:timers/promises';
import WelcomeModel from '../../../../assets/utils/models/Welcome';
import { SubCommand } from '../../../../structures/SlashCommand';
import type { IWelcomeDocument } from '../../../../typings/MongoTypes';
import type { ExtendedSelectMenuInteraction } from '../../../../typings/SlashCommand';
import { editOptions } from './src/selector/selectEdit';

export const editWelcomeCommand = new SubCommand({
	name: 'edit',
	description: 'Edit welcome message for the server',
	run: async ({ interaction }) => {
		if (!interaction.guild) return;
		const data = await WelcomeModel.findOne<IWelcomeDocument>({
			serverId: `${interaction.guild.id}`,
		});

		if (!data) {
			await interaction.editReply({
				content:
					'Welcome message has not been configured. Please configure one first with `/welcome configure`.',
			});
		} else {
			await interaction.editReply({
				content: 'Welcome message can be edited now. Proceeding to edit options...',
			});
			await wait(3_000);
			await editOptions(interaction as ExtendedSelectMenuInteraction);
		}
	},
});
