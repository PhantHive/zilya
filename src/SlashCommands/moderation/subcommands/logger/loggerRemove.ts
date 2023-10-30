import LoggerModel from '../../../../assets/utils/models/Logger';
import { SubCommand } from '../../../../structures/SlashCommand';
import type { ILoggerDocument } from '../../../../typings/MongoTypes';

export const removeLoggerCommand = new SubCommand({
	name: 'remove',
	description: 'Remove logger for the server',
	options: [],
	run: async ({ interaction }) => {
		if (!interaction.guild) return interaction.reply('This command can only be used in a server.');

		const data = await LoggerModel.findOne<ILoggerDocument>({
			serverId: interaction.guild.id,
		});

		try {
			if (!data) {
				return await interaction.reply({
					content: 'Logger is not configured for this server.',
					ephemeral: true,
				});
			} else {
				await LoggerModel.findOneAndDelete<ILoggerDocument>({
					serverId: interaction.guild.id,
				});

				return await interaction.reply({
					content: 'Logger has been removed.',
					ephemeral: true,
				});
			}
		} catch {
			return await interaction.reply({
				content: 'Error trying to remove logger.',
				ephemeral: true,
			});
		}
	},
});
