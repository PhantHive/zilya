import type {
    ColorResolvable,
    TextChannel,
} from 'discord.js';
import {
    EmbedBuilder,
    AuditLogEvent,
} from 'discord.js';
import colors from '../../assets/data/canvasColors.json' assert { type: 'json' };
import LoggerModel from '../../assets/utils/models/Logger';
import { Event } from '../../structures/Event';
import type { ILoggerDocument } from '../../typings/MongoTypes';

export default new Event('roleCreate', async (client, role) => {
    if (!role.guild) return;
    if (!client.user) return;

    try {
        const data = await LoggerModel.findOne<ILoggerDocument>({
            serverId: role.guild.id,
        });

        if (data) {
            const channelId = data.logChannel;

            let colorName = data.color.toLowerCase() as keyof typeof colors;
            if (!colors[colorName]) colorName = 'default';
            const color = colors[colorName];

            const logger = (await client.channels.fetch(
                channelId
            )) as TextChannel;

            if (logger) {
                const fetchedLogs = await role.guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.RoleCreate,
                });
                const roleCreateLog = fetchedLogs.entries.first();

                if (roleCreateLog) {
                    const { executor } = roleCreateLog;
                    if (!executor) return;

                    const embed = new EmbedBuilder()
                        .setAuthor({
                            name: `Executor> ${executor.tag}`,
                            iconURL: executor.displayAvatarURL(),
                        })
                        .setTitle('LOG: Role Created 📥')
                        .setDescription(
                            `**${executor.tag}** created a role: **${role.name}**.`
                        )
                        .setColor(color as ColorResolvable)
                        .addFields(
                            {
                                name: 'Role Name',
                                value: role.name,
                                inline: true,
                            },
                            {
                                name: 'Role Color',
                                value: role.hexColor,
                                inline: true,
                            },
                            {
                                name: 'Role Position',
                                value: role.position.toString(),
                                inline: true,
                            },
                            {
                                name: 'All IDs',
                                value: `\`\`\`js\nRole ID: ${role.id}\nExecutor ID: ${executor.id} \`\`\``,
                            }
                        )
                        .setTimestamp()
                        .setFooter({
                            text: `by PhearionNetwork. Sever: ${role.guild.name}`,
                            iconURL: client.user.displayAvatarURL(),
                        });

                    await logger.send({ embeds: [embed] });
                }
            }
        }
    } catch (error) {
        console.error('Error occurred in roleCreate event:', error);
    }
});
