import type { TextChannel, ColorResolvable } from 'discord.js';
import { EmbedBuilder, AuditLogEvent } from 'discord.js';
import colors from '../../assets/data/canvasColors.json' assert { type: 'json' };
import LoggerModel from '../../assets/utils/models/Logger';
import { Event } from '../../structures/Event';
import type { ILoggerDocument } from '../../typings/MongoTypes';

export default new Event('messageDelete', async (client, message) => {
	if (!message.guild) return;
	if (!message.author) return;
	if (message.author.bot) return;

	const data = await LoggerModel.findOne<ILoggerDocument>({
		serverId: message.guild.id,
	});

	if (!data) {
		return;
	}

	if (data) {
		const channelId = data.logChannel;
		let color: string;
		try {
			color = data.color;
		} catch {
			// set to Random color
			color = 'Random';
		}

		// find the channel by id using client.channels.fetch()
		const logger = (await client.channels.fetch(channelId)) as TextChannel;

		if (logger !== undefined) {
			if (!message.guild) return;

			// fetch the audit logs for deletions
			const fetchedLogs = await message.guild.fetchAuditLogs({
				limit: 1,
				type: AuditLogEvent.MessageDelete,
			});
			// since there's only 1 audit log entry in this collection, grab the first one
			const deletionLog = fetchedLogs.entries.first();
			// perform a coherence check to make sure that there's *something*
			if (!deletionLog) {
				console.log(
					`A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`,
				);
				return;
			}

			const { executor, target } = deletionLog;
			if (!executor || !target) return;

			// embeding
			let desc: string;
			let actionAuthor: string;
			if (target.id === message.author.id) {
				desc = `**${executor.tag}** deleted a message from: **${message.author.tag}**.`;
				actionAuthor = executor.id;
			} else {
				desc = `A message from: **${message.author.tag}** has been deleted.`;
				actionAuthor = 'Unknown';
			}

			const colorName = data.color.toLowerCase() as keyof typeof colors;
			color = colors[colorName];
			if (!client.user) return;
			const deleteLog = new EmbedBuilder()
				.setAuthor({
					name: `Target> ${message.author.tag}`,
					iconURL: message.author.avatarURL() as string,
				})
				.setTitle('LOG: Deleted Message')
				.setDescription(desc)
				.addFields(
					{
						name: 'Channel TAG',
						value: `<#${message.channel.id}>`,
					},
					{ name: 'Message', value: `> ${message.content}` },
					{
						name: 'All IDs',
						value: `\`\`\`js\nExecutor ID: ${actionAuthor}\nTarget ID: ${message.author.id}\nChannel ID: ${message.channel.id}\`\`\``,
					},
				)
				.setColor(color as ColorResolvable)
				.setTimestamp()
				.setFooter({
					text: `by PhearionNetwork. Sever: ${message.guild.name}`,
					iconURL: client.user.displayAvatarURL(),
				});

			await (logger as TextChannel).send({ embeds: [deleteLog] });
		}
	}
});
