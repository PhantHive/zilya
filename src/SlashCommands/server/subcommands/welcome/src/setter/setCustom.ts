import { setTimeout } from 'node:timers/promises';
import type { Message } from 'discord.js';
import { ChannelType } from 'discord.js';
import themes from '../../../../../../assets/data/theme.json' assert { type: 'json' };
import type { IWelcomeDocument } from '../../../../../../typings/MongoTypes';
import type { ExtendedSelectMenuInteraction } from '../../../../../../typings/SlashCommand';
import { selectChannelId, selectWelcomeTheme, selectWelcomeColor } from '../selector/selectCustom';

const isChannelValid = async (channel: string, configName: string) => {
	const id = Number(channel);
	if (Number.isInteger(id) && id !== 0) {
		return { isValid: true, msg: `Thank you! I will setup ${configName} message in this channel.` };
	} else {
		return {
			isValid: false,
			msg: `Sorry, I can't setup the ${configName} message in this channel. It is probably not a valid channel.`,
		};
	}
};

const nextStep = async (data: IWelcomeDocument, interaction: ExtendedSelectMenuInteraction) => {
	try {
		if (!interaction.guild) throw new Error('This command can only be used in a server.');
		const channels = interaction.guild.channels.cache
			.filter((guild) => guild.type === ChannelType.GuildText)
			.map((guild) => {
				return {
					label: `${guild.name}`,
					value: `${guild.id}`,
				};
			});

		if (channels.length >= 25) {
			channels.splice(24, channels.length - 23);
		}

		const theme = themes.find((theme) => theme.value === data.theme);
		if (!theme) {
			console.log('theme not found...');
			return;
		}

		if (data.channelId === '0') {
			await selectChannelId(interaction, channels);
		} else if (data.theme === -1) {
			await selectWelcomeTheme(interaction);
		} else if (data.color === '#000000') {
			await selectWelcomeColor(interaction);
		} else {
			const msg =
				`All data are saved for <#${data.channelId}>\n` +
				`\`\`\`js\nChannel ID: ${data.channelId}\n` +
				`Theme: ${theme.name}\n` +
				`Color: ${data.color}\`\`\`` +
				`you can reset the welcome message with the command: \`/welcome remove\` or edit it with the command: \`/welcome edit\``;
			await interaction.reply({
				content: msg,
			});
		}
	} catch (error) {
		console.error('An error occurred while handling the next step:', error);
		await interaction.reply('An unexpected error occurred. Please try again later.');
	}
};

const setChannelId = async (data: IWelcomeDocument, interaction: ExtendedSelectMenuInteraction) => {
	try {
		const channelId = interaction.values[0];
		if (!channelId) throw new Error('An unexpected error occurred. Please try again later.');
		if (channelId === 'manually') {
			await interaction.update({
				content: 'Please write the ID of the desired channel for welcome messages to appear.',
				components: [],
			});

			const filter = (msg: Message) => msg.author.id === interaction.user.id;
			if (!interaction.channel) throw new Error('This command can only be used in a server.');
			const collectedMessages = await interaction.channel.awaitMessages({
				filter,
				time: 60_000,
				max: 1,
			});

			if (!collectedMessages.size)
				throw new Error('You did not provide any input. Operation cancelled.');

			const message = collectedMessages.first();
			if (!message) throw new Error('An unexpected error occurred. Please try again later.');
			const { isValid, msg } = await isChannelValid(message.content, 'welcome');
			if (!isValid) throw new Error(msg);
			data.channelId = message.content;
			await data.save();
			await setTimeout(2_000);
			await message.delete();
		} else {
			const { isValid, msg } = await isChannelValid(channelId, 'welcome');
			if (!isValid) throw new Error(msg);
			data.channelId = channelId;
			await data.save();
		}

		const response =
			'Thank you! I will setup the welcome message in this channel. Proceeding to the next step...';
		await interaction.update({ content: response, components: [] });
		await setTimeout(2_000);
		await nextStep(data, interaction);
	} catch (error) {
		const errorMessage =
			typeof error === 'string' ? error : 'An unexpected error occurred. Please try again later.';
		await interaction.reply({ content: errorMessage, ephemeral: true });
		await interaction.update({ content: errorMessage, components: [] }).catch(async () => {
			await interaction.editReply({ content: errorMessage });
		});
		await setTimeout(2_000);
		await nextStep(data, interaction);
	}
};

// the third function setTheme(data, interaction) will get the value and set the theme accordingly before proceeding to the nextStep() function
const setTheme = async (data: IWelcomeDocument, interaction: ExtendedSelectMenuInteraction) => {
	// make it a promises, if the set fail then warn the user and abort the command
	const themeValue = interaction.values[0];
	if (!themeValue) throw new Error('An unexpected error occurred. Please try again later.');
	const choosedTheme = Number.parseInt(themeValue, 10);
	const themeName = themes.find((theme) => theme.value === choosedTheme)?.name;

	try {
		if (choosedTheme >= 0 && choosedTheme <= 5) {
			await data.updateOne({ _id: data._id }, { $set: { theme: choosedTheme } });
			const response = `You chose the theme: **${themeName}**, I will set up the welcome message with this theme.\n Proceeding to the next step...`;
			await interaction.update({ content: response, components: [] });
			await setTimeout(2_000);
			await nextStep(data, interaction);
		} else {
			const errorMessage =
				"Sorry, I can't set up the welcome message with this theme. Please try again.";
			await interaction.update({ content: errorMessage, components: [] });
		}
	} catch (error) {
		console.error('An error occurred while handling the theme choice:', error);
		await interaction.reply('An unexpected error occurred. Please try again later.');
	}
};

// last function is for color, it will get the value and set the color accordingly before proceeding to the nextStep() function
const setColor = async (data: IWelcomeDocument, interaction: ExtendedSelectMenuInteraction) => {
	// make it a promises, if the set fail then warn the user and abort the command
	const choosedColor = interaction.values[0];

	try {
		if (choosedColor !== '#000000') {
			await data.updateOne({ _id: data._id }, { $set: { color: choosedColor } });
			const response = `You chose the color: **${choosedColor}**, I will set up the welcome message with this color.\n Proceeding to the next step...`;
			await interaction.update({ content: response, components: [] });
			await setTimeout(2_000);
			await nextStep(data, interaction);
		} else {
			const errorMessage =
				"Sorry, I can't set up the welcome message with this color. Please try again.";
			await interaction.update({ content: errorMessage, components: [] });
		}
	} catch (error) {
		console.error('An error occurred while handling the color choice:', error);
		await interaction.reply('An unexpected error occurred. Please try again later.');
	}
};

export { nextStep, setChannelId, setTheme, setColor };
