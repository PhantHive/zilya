import type { TextChannel, ColorResolvable, User, Role } from 'discord.js';
import { EmbedBuilder, AuditLogEvent } from 'discord.js';
import colors from '../../assets/data/canvasColors.json' assert { type: 'json' };
import LoggerModel from '../../assets/utils/models/Logger';
import type { ExtendedClient } from '../../structures/Client.ts';
import { Event } from '../../structures/Event';
import type { ILoggerDocument } from '../../typings/MongoTypes';

// function promises to send embeds to the log channel
async function sendEmbed(
	client: ExtendedClient,
	logger: TextChannel,
	color: ColorResolvable,
	executor: User,
	tagName: string,
	tagValue: string,
	fieldComment: string,
	desc: string,
	changeName: string,
	oldRole: Role,
) {
	if (!client.user) return;
	const colorName = color as keyof typeof colors;
	const embedColor = colors[colorName];
	const embed = new EmbedBuilder()
		.setAuthor({
			name: `Executor> ${executor.tag}`,
			iconURL: executor.displayAvatarURL(),
		})
		.setTitle(tagName)
		.setDescription(desc)
		.setColor(embedColor as ColorResolvable)
		.addFields(
			{
				name: changeName,
				value: tagValue,
				inline: false,
			},
			{
				name: 'All IDs',
				value: fieldComment,
				inline: false,
			},
		)
		.setTimestamp()
		.setFooter({
			text: `by PhearionNetwork. Sever: ${oldRole.guild.name}`,
			iconURL: client.user.displayAvatarURL(),
		});

	await logger.send({ embeds: [embed] });
}

export default new Event('roleUpdate', async (client, oldRole, newRole) => {
	if (!oldRole.guild) return;

	const data = await LoggerModel.findOne<ILoggerDocument>({
		serverId: oldRole.guild.id,
	});

	if (data) {
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
			const fetchedLogs = await oldRole.guild.fetchAuditLogs({
				limit: 1,
				type: AuditLogEvent.RoleUpdate,
			});
			if (!fetchedLogs) return;
			// since there's only 1 audit log entry in this collection, grab the first one
			const roleUpdateLog = fetchedLogs.entries.first();
			if (!roleUpdateLog) return;
			const { executor } = roleUpdateLog;

			if (!executor) return;
			let fieldComment: string;
			let tagValue: string;
			let tagName: string;
			let desc: string;
			let changeName: string;
			const oldPerms = oldRole.permissions.toArray();
			const newPerms = newRole.permissions.toArray();

			if (oldRole.name !== newRole.name) {
				changeName = 'Name';
				tagName = 'Role name changed';
				tagValue = `\`\`\`js\nOld name: ${oldRole.name}\nNew name: ${newRole.name}\`\`\``;
				fieldComment = `\`\`\`js\nRole ID: ${newRole.id}\nExecutor ID: ${executor.id}\`\`\``;
				desc = `**${executor.tag}** changed the name of the role: **${oldRole.name}** to **${newRole.name}**.`;
				await sendEmbed(
					client,
					logger,
					color,
					executor,
					tagName,
					tagValue,
					fieldComment,
					desc,
					changeName,
					oldRole,
				);
			}

			if (oldRole.hexColor !== newRole.hexColor) {
				changeName = 'Color';
				tagName = 'Role color changed';
				tagValue = `\`\`\`js\nOld color: ${oldRole.hexColor}\nNew color: ${newRole.hexColor}\`\`\``;
				fieldComment = `\`\`\`js\nRole ID: ${newRole.id}\nExecutor ID: ${executor.id}\`\`\``;
				desc = `**${executor.tag}** changed the color of the role: **${oldRole.hexColor}** to **${newRole.hexColor}**.`;
				await sendEmbed(
					client,
					logger,
					color,
					executor,
					tagName,
					tagValue,
					fieldComment,
					desc,
					changeName,
					oldRole,
				);
			}

			if (oldRole.hoist !== newRole.hoist) {
				changeName = 'Hoist';
				tagName = 'Role hoist changed';
				tagValue = `\`\`\`js\nOld hoist: ${oldRole.hoist}\nNew hoist: ${newRole.hoist}\`\`\``;
				fieldComment = `\`\`\`js\nRole ID: ${newRole.id}\nExecutor ID: ${executor.id}\`\`\``;
				desc = `**${executor.tag}** changed the hoist of the role: **${oldRole.hoist}** to **${newRole.hoist}**.`;
				await sendEmbed(
					client,
					logger,
					color,
					executor,
					tagName,
					tagValue,
					fieldComment,
					desc,
					changeName,
					oldRole,
				);
			}

			if (oldRole.mentionable !== newRole.mentionable) {
				changeName = 'Mentionable';
				tagName = 'Role mentionable changed';
				tagValue = `\`\`\`js\nOld mentionable: ${oldRole.mentionable}\nNew mentionable: ${newRole.mentionable}\`\`\``;
				fieldComment = `\`\`\`js\nRole ID: ${newRole.id}\nExecutor ID: ${executor.id}\`\`\``;
				desc = `**${executor.tag}** changed the mentionable of the role: **${oldRole.mentionable}** to **${newRole.mentionable}**.`;
				await sendEmbed(
					client,
					logger,
					color,
					executor,
					tagName,
					tagValue,
					fieldComment,
					desc,
					changeName,
					oldRole,
				);
			}

			// check if new permissions are added or removed
			if (oldPerms.length < newPerms.length) {
				changeName = 'Added permissions';
				tagName = 'Role permissions changed (added)';
				const addedPerms = newPerms
					.filter((perm) => !oldPerms.includes(perm))
					.map((perm) => `🟢 ${perm}`);
				tagValue = `\`\`\`js\n${addedPerms.join('\n')}\`\`\``;
				fieldComment = `\`\`\`js\nRole ID: ${newRole.id}\nExecutor ID: ${executor.id}\`\`\``;
				desc = `**${executor.tag}** added a/multiple permission(s) on **${oldRole.name}** role`;
				await sendEmbed(
					client,
					logger,
					color,
					executor,
					tagName,
					tagValue,
					fieldComment,
					desc,
					changeName,
					oldRole,
				);
			}

			if (oldPerms.length > newPerms.length) {
				changeName = 'Removed permissions';
				tagName = 'Role permissions changed (removed)';
				const removedPerms = oldPerms
					.filter((perm) => !newPerms.includes(perm))
					.map((perm) => `🔻 ${perm}`);
				tagValue = `\`\`\`js\n${removedPerms.join('\n')}\`\`\``;
				fieldComment = `\`\`\`js\nRole ID: ${newRole.id}\nExecutor ID: ${executor.id}\`\`\``;
				desc = `**${executor.tag}** removed a/multiple permission(s) on **${oldRole.name}** role`;
				await sendEmbed(
					client,
					logger,
					color,
					executor,
					tagName,
					tagValue,
					fieldComment,
					desc,
					changeName,
					oldRole,
				);
			}
		}
	}
});
