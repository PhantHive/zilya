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

export default new Event('roleDelete', async (role) => {
    if (!role.guild) return;

    let data = await Models.LoggerModel.findOne({
        serverId: role.guild.id,
    });

    try {
        if (data) {
            const channelId = data.logChannel;
            let color: ColorResolvable;
            try {
                color = data.color as ColorResolvable;
            } catch (e) {
                // set to Random color
                color = 'Random';
            }
            // find the channel by id using client.channels.fetch()
            const logger = (await client.channels.fetch(
                channelId
            )) as TextChannel;

            if (logger !== undefined) {
                const fetchedLogs = await role.guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.RoleDelete,
                });
                // since there's only 1 audit log entry in this collection, grab the first one
                const deletionLog = fetchedLogs.entries.first();
                // grab the user object of the person who deleted the role
                const { executor } = deletionLog;
                color = colors[data.color.toLowerCase()];
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `Executor> ${executor.tag}`,
                        iconURL: executor.displayAvatarURL(),
                    })
                    .setTitle(`LOG: Role Deleted  📤`)
                    .setDescription(
                        `**${executor.tag}** deleted a role: **${role.name}**.`
                    )
                    .setColor(color)
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
                        }
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
