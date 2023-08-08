import { Event } from '../../structures/Event';
import { client } from '../../index';
import {
    EmbedBuilder,
    AuditLogEvent,
    TextChannel,
    ColorResolvable,
} from 'discord.js';
import Models from '../../typings/MongoTypes';
import colors from '../../assets/data/canvasColors.json';

export default new Event('roleCreate', async (role) => {
    if (!role.guild) return;

    try {
        const data = await Models.LoggerModel.findOne({
            serverId: role.guild.id,
        });

        if (data) {
            const channelId = data.logChannel;
            const color = colors[data.color.toLowerCase()] || 'RANDOM';

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

                    const embed = new EmbedBuilder()
                        .setAuthor({
                            name: `Executor> ${executor.tag}`,
                            iconURL: executor.displayAvatarURL(),
                        })
                        .setTitle('LOG: Role Created 📥')
                        .setDescription(
                            `**${executor.tag}** created a role: **${role.name}**.`
                        )
                        .setColor(color)
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
