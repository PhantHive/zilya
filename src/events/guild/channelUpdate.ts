import type { ColorResolvable, TextChannel } from 'discord.js';
import { EmbedBuilder, AuditLogEvent } from 'discord.js';
import colors from '../../assets/data/canvasColors.json' assert { type: 'json' };
import LM from '../../assets/utils/models/Logger';
import { client } from '../../index';
import { Event } from '../../structures/Event';

export default new Event('channelUpdate', async (oldChannel, newChannel) => {
	const oldTextChannel = oldChannel as TextChannel;
	const newTextChannel = newChannel as TextChannel;

	if (!oldTextChannel.guild) return;
	if (!client.user) return;

	const data = await LM.findOne({
		serverId: oldTextChannel.guild.id,
	});
	try {
		if (!data) return;

		const channelId = data.logChannel;
		let color: ColorResolvable;
		try {
			color = data.color as ColorResolvable;
		} catch {
			// set to Random color
			color = 'Random';
		}

		// find the channel by id using client.channels.fetch()
		const logger = (await client.channels.fetch(channelId)) as TextChannel;

		if (logger !== undefined) {
			let fieldComment;
			let tagValue;
			let tagName;
			let desc;
			// get user who made the changes
			const fetchedLogs = await oldTextChannel.guild.fetchAuditLogs({
				limit: 1,
				type: AuditLogEvent.ChannelUpdate,
			});
			// since there's only 1 audit log entry in this collection, grab the first one
			const channelUpdateLog = fetchedLogs.entries.first();
			if (!channelUpdateLog) return;
			const { executor } = channelUpdateLog;
			if (!executor) return;

			if (oldTextChannel.name !== newTextChannel.name) {
				tagName = 'Channel name changed';
				tagValue = `\`\`\`js\nOld name: ${oldTextChannel.name}\nNew name: ${newTextChannel.name}\`\`\``;
				fieldComment = `\`\`\`js\nExecutor ID: ${executor.id}\nChannel ID: ${newTextChannel.id}\`\`\``;
				desc = `**${executor.tag}** changed the name of the channel: **${oldTextChannel.name}** to **${newTextChannel.name}**.`;
			} else if (oldTextChannel.nsfw !== newTextChannel.nsfw) {
				tagName = 'Channel nsfw changed';
				tagValue = `\`\`\`js\nOld nsfw: ${oldTextChannel.nsfw}\nNew nsfw: ${newTextChannel.nsfw}\`\`\``;
				fieldComment = `\`\`\`js\nExecutor ID: ${executor.id}\nChannel ID: ${newTextChannel.id}\`\`\``;
				desc = `**${executor.tag}** changed the nsfw of the channel: **${oldTextChannel.name}** to **${newTextChannel.nsfw}**.`;
			} else if (oldTextChannel.rateLimitPerUser !== newTextChannel.rateLimitPerUser) {
				tagName = 'Channel slowmode changed';
				tagValue = `\`\`\`js\nOld slowmode: ${oldTextChannel.rateLimitPerUser} second(s)\nNew slowmode: ${newTextChannel.rateLimitPerUser}second(s)\`\`\``;
				fieldComment = `\`\`\`js\nExecutor ID: ${executor.id}\nChannel ID: ${newTextChannel.id}\`\`\``;
				desc = `**${executor.tag}** changed the slowmode of the channel: **${oldTextChannel.name}** to **${newTextChannel.rateLimitPerUser}**second(s).`;
			} else if (oldTextChannel.parent !== newTextChannel.parent) {
				tagName = 'Channel parent changed';
				tagValue = `\`\`\`js\nOld parent: ${oldTextChannel.parent?.name}\nNew parent: ${newTextChannel.parent?.name}\`\`\``;
				fieldComment = `\`\`\`js\nExecutor ID: ${executor.id}\nChannel ID: ${newTextChannel.id}\`\`\``;
				desc = `**${executor.tag}** changed the parent of the channel: **${oldTextChannel.name}** to **${newTextChannel.parent}**.`;
			} else if (oldTextChannel.permissionOverwrites !== newTextChannel.permissionOverwrites) {
				// get all old roles and new roles names
				const oldRoles = [];
				const newRoles = [];
				// get role name from id
				for (const [id] of oldTextChannel.permissionOverwrites.cache) {
					const name = oldTextChannel.guild.roles.cache.get(id)?.name;
					if (name) {
						oldRoles.push(name);
					}
				}

				for (const [id] of newTextChannel.permissionOverwrites.cache) {
					const name = newTextChannel.guild.roles.cache.get(id)?.name;
					if (name) {
						newRoles.push(name);
					}
				}

				tagName = 'Channel permission overwrites changed';
				tagValue = `\`\`\`js\nOld permission overwrites: ${oldRoles}\nNew permission overwrites: ${newRoles}\`\`\``;
				fieldComment = `\`\`\`js\nExecutor ID: ${executor.id}\nChannel ID: ${newChannel.id}\`\`\``;
				desc = `**${executor.tag}** changed the permission overwrites of the channel: **${oldTextChannel.name}**.`;
			}

			let colorName = color as keyof typeof colors;
			if (!colors[colorName]) colorName = 'default';

			const embed = new EmbedBuilder()
				.setAuthor({
					name: `Executor> ${executor.tag}`,
					iconURL: executor.avatarURL() as string,
				})
				.setColor(colors[colorName] as ColorResolvable)
				.setTitle(`LOG: ${tagName}`)
				.setDescription(desc as string)
				.addFields(
					{
						name: 'Changes',
						value: tagValue ?? 'N/A',
					},
					{
						name: 'All IDs',
						value: fieldComment ?? 'N/A',
					},
				)
				.setTimestamp()
				.setFooter({
					text: `by PhearionNetwork. Sever: ${oldTextChannel.guild.name}`,
					iconURL: client.user.avatarURL() as string,
				});
			await logger.send({ embeds: [embed] });
		}
	} catch {}
});
