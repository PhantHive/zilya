import type { ColorResolvable } from 'discord.js';
import { EmbedBuilder } from 'discord.js';
import colors from '../../../../assets/data/canvasColors.json' assert { type: 'json' };
import LoggerModel from '../../../../assets/utils/models/Logger';
import { SubCommand } from '../../../../structures/SlashCommand';
import type { ILoggerDocument } from '../../../../typings/MongoTypes';
import type { ExtendedInteraction } from '../../../../typings/SlashCommand';

export const configureLoggerCommand = new SubCommand({
	name: 'config',
	description: 'Configure logger for the server',
	run: async ({ interaction }) => {
		const channelOption = (interaction as ExtendedInteraction).options.get('channel_id');
		const notifOption = (interaction as ExtendedInteraction).options.get('notif');
		const colorOption = (interaction as ExtendedInteraction).options.get('color');

		if (!channelOption?.channel) {
			await interaction.reply({
				content: 'Please choose a text channel. Cannot log into a voice channel.',
				ephemeral: true,
			});
			return;
		}

		const channelId = channelOption.channel.id;
		const notifType = notifOption?.value as string | undefined;
		const color = colorOption?.value as string | 'default' | undefined;

		const serverName = interaction.guild?.name;
		const serverId = interaction.guild?.id;

		if (!serverName || !serverId) {
			await interaction.reply({
				content: 'This command can only be used in a server.',
				ephemeral: true,
			});
			return;
		}

		const data = await LoggerModel.findOne<ILoggerDocument>({
			serverId,
		});

		try {
			let embed: EmbedBuilder;
			if (!data) {
				await new LoggerModel({
					serverId,
					notifType,
					logChannel: channelId,
					color,
				}).save();

				let colorName = color as keyof typeof colors;
				if (!colors[colorName]) colorName = 'default';

				embed = new EmbedBuilder()
					.setColor(colors[colorName] as ColorResolvable)
					.setTitle(`${serverId}: ${serverName}`)
					.setDescription(`Logger has been configured.`)
					.addFields(
						{ name: 'Channel ID', value: channelId, inline: true },
						{ name: 'Notification Type', value: notifType ?? 'all', inline: true },
					);

				return await interaction.reply({ embeds: [embed] });
			}

			let colorName = color as keyof typeof colors;
			if (!colors[colorName]) colorName = 'default';

			embed = new EmbedBuilder()
				.setColor(colors[colorName] as ColorResolvable)
				.setTitle(`${serverId}: ${serverName}`)
				.setDescription(`This server already has a log channel. \`/logger remove\` to change it.`);

			return await interaction.reply({ embeds: [embed] });
		} catch {
			await interaction.reply({
				content: 'Error trying to configure logger.',
				ephemeral: true,
			});
		}

		return;
		
	},
});
