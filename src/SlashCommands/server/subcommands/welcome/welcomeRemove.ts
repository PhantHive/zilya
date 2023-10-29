import { ActionRowBuilder, ButtonStyle, ButtonBuilder } from 'discord.js';
import WelcomeModel from '../../../../assets/utils/models/Welcome';
import { SubCommand } from '../../../../structures/SlashCommand';
import type { IWelcomeDocument } from '../../../../typings/MongoTypes';

export const removeWelcomeCommand = new SubCommand({
	name: 'remove',
	description: 'Remove welcome message for the server',
	run: async ({ interaction }) => {
		if (!interaction.guild) return;
		try {
			const data = await WelcomeModel.findOne<IWelcomeDocument>({
				serverId: `${interaction.guild.id}`,
			});

			if (!data) {
				await interaction.reply({
					content:
						'There is no welcome message to remove.\nPlease configure one first with `/welcome configure`.',
				});
				return;
			}

			const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder()
					.setCustomId('welcome_remove_yes')
					.setLabel('✅')
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('welcome_remove_no')
					.setLabel('❌')
					.setStyle(ButtonStyle.Secondary),
			);

			await interaction.reply({
				content: 'Are you sure you want to remove the welcome message?',
				components: [actionRow],
			});
		} catch (error) {
			console.error('An error occurred:', error);
			await interaction.reply({
				content: 'An unexpected error occurred. Please try again later.',
			});
		}
	},
});
