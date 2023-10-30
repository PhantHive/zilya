import type { ColorResolvable, GuildMember, Role, TextChannel } from 'discord.js';
import { AuditLogEvent, EmbedBuilder } from 'discord.js';
import colors from '../../assets/data/canvasColors.json' assert { type: 'json' };
import LoggerModel from '../../assets/utils/models/Logger';
import { Event } from '../../structures/Event';
import type { ILoggerDocument } from '../../typings/MongoTypes';
import { ExtendedClient } from '../../structures/Client.ts';

async function sendEmbed(
	client: ExtendedClient,
	logger: TextChannel,
	color: string,
	executor: any,
	tagName: string,
	tagValue: string,
	fieldComment: string,
	desc: string,
	changeName: string,
	oldRole: GuildMember,
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

export default new Event('guildMemberUpdate', async (client, oldMember, newMember) => {
	if (!oldMember.guild) return;

	if (oldMember.user.bot) return;

	const data = await LoggerModel.findOne<ILoggerDocument>({
		serverId: newMember.guild.id,
	});

	if (!data) return;
	const color = data.color;
	const channelId = data.logChannel;
	// find the channel by id using client.channels.fetch()
	const logger = (await client.channels.fetch(channelId)) as TextChannel;

	if (logger !== undefined) {
		const fetchedLogs = await oldMember.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.MemberRoleUpdate,
		});
		// since there's only 1 audit log entry in this collection, grab the first one
		if (!fetchedLogs) return;
		const auditLog = fetchedLogs.entries.first();
		if (!auditLog) return;
		// grab the user object of the person who updated the member
		const { executor } = auditLog;

		let newRole: Role | undefined;
		let tagName: string;
		let tagValue: string;
		let fieldComment: string;
		let desc: string;
		let changeName: string;

		if (oldMember.roles.cache.size < newMember.roles.cache.size) {
			newRole = newMember.roles.cache.filter((role) => !oldMember.roles.cache.has(role.id)).first();
			if (!newRole) return;
			tagName = 'Role Added';
			tagValue = `🟢 ${newRole}`;
			fieldComment = `\`\`\`js\nMember: ${newMember.user.id}\nRole: ${newRole.id}\`\`\``;
			desc = `**${newMember.user.tag}** was given the **${newRole.name}** role.`;
			changeName = 'Role Added';
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
				newMember,
			);
		} else if (oldMember.roles.cache.size > newMember.roles.cache.size) {
			newRole = oldMember.roles.cache.filter((role) => !newMember.roles.cache.has(role.id)).first();
			if (!newRole) return;
			tagName = 'Role Removed';
			tagValue = `🔴 ${newRole}`;
			fieldComment = `\`\`\`js\nMember: ${newMember.user.id}\nRole: ${newRole.id}\`\`\``;
			desc = `**${newMember.user.tag}** was removed from the **${newRole.name}** role.`;
			changeName = 'Role Removed';
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
				newMember,
			);
		} else if (oldMember.nickname !== newMember.nickname) {
			const newNickname = newMember.nickname ?? newMember.user.username;
			const oldNickname = oldMember.nickname ?? oldMember.user.username;
			tagName = 'Nickname Changed';
			tagValue = `📝 ${oldNickname} ➡️ ${newNickname}`;
			fieldComment = `\`\`\`js\nMember: ${newMember.user.id}\`\`\``;
			desc = `**${newMember.user.tag}**'s nickname was changed.`;
			changeName = 'Nickname Changed';
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
				newMember,
			);
		}
	}
});
