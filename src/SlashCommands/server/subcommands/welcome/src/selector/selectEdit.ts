import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import type { ExtendedSelectMenuInteraction } from '../../../../../../typings/SlashCommand';

const editOptions = async (interaction: ExtendedSelectMenuInteraction) => {
	const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
		new StringSelectMenuBuilder()
			.setCustomId('edit_welcome')
			.setPlaceholder('Choose an option')
			.addOptions(
				{
					label: 'Edit channel id',
					emoji: '📝',
					value: 'edit_channel_id',
				},
				{
					label: 'Edit color',
					emoji: '🎨',
					value: 'edit_color',
				},
				{
					label: 'Edit theme',
					emoji: '🦄',
					value: 'edit_theme',
				},
			),
	);

	try {
		await interaction.editReply({
			content: 'What do you wish to edit?',
			components: [actionRow],
		});
	} catch (error) {
		console.error('An error occurred:', error);
		await interaction.editReply({
			content: 'An unexpected error occurred. Please try again later.',
		});
	}
};

export { editOptions };
