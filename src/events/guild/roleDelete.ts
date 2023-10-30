import type { TextChannel, ColorResolvable } from 'discord.js';
import { EmbedBuilder, AuditLogEvent } from 'discord.js';
import colors from '../../assets/data/canvasColors.json' assert { type: 'json' };
import LoggerModel from '../../assets/utils/models/Logger';
import { Event } from '../../structures/Event';
import type { ILoggerDocument } from '../../typings/MongoTypes';

export default new Event('roleDelete', async (client, role) => {
	if (!role.guild) return;
	if (!client.user) return;

	const data = await LoggerModel.findOne<ILoggerDocument>({
		serverId: role.guild.id,
	});

	try {
		if (data) {
			const channelId = data.logChannel;
			let color: string;
			try {
				color = data.color as string;
			} catch {
				// set to Random color
				color = 'Random';
			}

			// find the channel by id using client.channels.fetch()
			const logger = (await client.channels.fetch(channelId)) as TextChannel;

			if (logger !== undefined) {
				const fetchedLogs = await role.guild.fetchAuditLogs({
					limit: 1,
					type: AuditLogEvent.RoleDelete,
				});
				// since there's only 1 audit log entry in this collection, grab the first one
				const deletionLog = fetchedLogs.entries.first();
				if (!deletionLog) return;

				const { executor } = deletionLog;
				if (!executor) return;

				const colorName = data.color.toLowerCase() as keyof typeof colors;
				color = colors[colorName];

				const embed = new EmbedBuilder()
					.setAuthor({
						name: `Executor> ${executor.tag}`,
						iconURL: executor.displayAvatarURL(),
					})
					.setTitle(`LOG: Role Deleted  📤`)
					.setDescription(`**${executor.tag}** deleted a role: **${role.name}**.`)
					.setColor(color as ColorResolvable)
					.addFields(
						{
							name: `Role Name`,
							value: `${role.name}`,
							inline: true,
						},
						{
							name: `Role Color`,
							value: `${role.hexColor}`,
							inline: true,
						},
						{
							name: `Role Position`,
							value: `${role.position}`,
							inline: true,
						},
						{
							name: `All IDs`,
							value: `\`\`\`js\nRole ID: ${role.id}\nExecutor ID: ${executor.id} \`\`\``,
						},
					)
					.setTimestamp()
					.setFooter({
						text: `by PhearionNetwork. Sever: ${role.guild.name}`,
						iconURL: client.user.displayAvatarURL(),
					});
				// send the embed to the channel
				await logger.send({ embeds: [embed] });
			}
		}
	} catch (error) {
		console.error(error);
	}
});
