import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import type { ExtendedSelectMenuInteraction } from '../../../../../../typings/SlashCommand';

const selectChannelId = async (interaction: ExtendedSelectMenuInteraction, channels: any) => {
	const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
		new StringSelectMenuBuilder()
			.setCustomId('channel_id')
			.setPlaceholder('Select channel to send.')
			.addOptions(...channels, {
				label: 'None of the above',
				description: 'I will select the channel manually.',
				value: 'manually',
			}),
	);

	const setupMsg =
		"Hello, Let's setup your welcome message on this server!" +
		'\nAs I can only show you the 25 first channel, you may want to select the "None of the above" option if you want to select the channel manually.';

	await interaction.reply({ content: setupMsg, components: [actionRow] }).catch(async () => {
		await interaction.editReply({
			content: setupMsg,
			components: [actionRow],
		});
	});
};

const selectWelcomeTheme = async (interaction: ExtendedSelectMenuInteraction) => {
	const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
		new StringSelectMenuBuilder().setCustomId('theme').setPlaceholder('Choose a theme').addOptions(
			{
				label: 'Planes',
				emoji: '1008063352569872465',
				value: '0',
			},
			{
				label: 'Waifu',
				emoji: '1008062691765653554',
				value: '1',
			},
			{
				label: 'Landscapes',
				emoji: '1008063338355359834',
				value: '2',
			},
			{
				label: 'System',
				emoji: '864986373714214972',
				value: '3',
			},
			{
				label: 'Phearion',
				emoji: '879146014232170506',
				value: '4',
			},
			{
				label: 'Apocalypse',
				emoji: '830887343081783340',
				value: '5',
			},
		),
	);
	// await interaction.editReply({ content: "You may want to customize your welcome message :)." });
	await interaction
		.reply({
			content: 'You may want to customize your welcome message :).',
			components: [actionRow],
		})
		.catch(async () => {
			await interaction.editReply({
				content: 'You may want to customize your welcome message :).',
				components: [actionRow],
			});
		});
};

const selectWelcomeColor = async (interaction: ExtendedSelectMenuInteraction) => {
	const colorRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
		new StringSelectMenuBuilder().setCustomId('color').setPlaceholder('Choose a color').addOptions(
			{
				label: 'Blue',
				emoji: '💙',
				value: 'blue',
			},
			{
				label: 'Red',
				emoji: '♥️',
				value: 'red',
			},
			{
				label: 'Green',
				emoji: '💚',
				value: 'green',
			},
			{
				label: 'Yellow',
				emoji: '💛',
				value: 'yellow',
			},
			{
				label: 'Purple',
				emoji: '💜',
				value: 'purple',
			},
			{
				label: 'Black',
				emoji: '🖤',
				value: 'black',
			},
		),
	);
	// await interaction.editReply({ content: "Choose your color." });
	await interaction
		.reply({ content: 'Choose your color.', components: [colorRow] })
		.catch(async () => {
			await interaction.editReply({
				content: 'Choose your color.',
				components: [colorRow],
			});
		});
};

export { selectChannelId, selectWelcomeTheme, selectWelcomeColor };
