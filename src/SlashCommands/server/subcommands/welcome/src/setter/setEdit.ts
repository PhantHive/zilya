import type { IWelcomeDocument } from '../../../../../../typings/MongoTypes';
import type { ExtendedSelectMenuInteraction } from '../../../../../../typings/SlashCommand';
import { nextStep } from './setCustom';

const setEdit = async (
	data: IWelcomeDocument,
	interaction: ExtendedSelectMenuInteraction,
	value: string,
) => {
	if (!data) {
		await interaction.editReply({
			content:
				'Welcome message has been removed while the edit process was ongoing. Please configure one first with `/welcome configure`.',
		});
		return;
	}

	const update: Record<string, number | string> = {};

	if (value === 'edit_channel_id') {
		update.channelId = '0';
	} else if (value === 'edit_theme') {
		update.theme = -1;
	} else if (value === 'edit_color') {
		update.color = '#000000';
	}

	if (Object.keys(update).length > 0) {
		await data.updateOne(update);
		await nextStep(data, interaction);
	}

	await interaction.editReply({
		content: 'Welcome message has been edited successfully.',
	});
};

export { setEdit };
