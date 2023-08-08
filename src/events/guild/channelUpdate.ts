import { Event } from '../../structures/Event';
import { client } from '../../index';
import {
    Message,
    EmbedBuilder,
    AuditLogEvent,
    TextChannel,
    Channel,
    ColorResolvable,
} from 'discord.js';
import LM from '../../assets/utils/models/Logger';
import colors from '../../assets/data/canvasColors.json';

export default new Event(
    'channelUpdate',
    async (oldChannel: TextChannel, newChannel: TextChannel) => {
        if (!oldChannel.guild) return;

        let data = await LM.findOne({
            serverId: oldChannel.guild.id,
        });
        try {
            new Promise(async (resolve) => {
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
                        let fieldComment;
                        let tagValue;
                        let tagName;
                        let desc;
                        // get user who made the changes
                        const fetchedLogs =
                            await oldChannel.guild.fetchAuditLogs({
                                limit: 1,
                                type: AuditLogEvent.ChannelUpdate,
                            });
                        // since there's only 1 audit log entry in this collection, grab the first one
                        const channelUpdateLog = fetchedLogs.entries.first();
                        // grab the user object of the person who made the changes
                        const { executor } = channelUpdateLog;

                        if (oldChannel.name !== newChannel.name) {
                            tagName = 'Channel name changed';
                            tagValue = `\`\`\`js\nOld name: ${oldChannel.name}\nNew name: ${newChannel.name}\`\`\``;
                            fieldComment = `\`\`\`js\nExecutor ID: ${executor.id}\nChannel ID: ${newChannel.id}\`\`\``;
                            desc = `**${executor.tag}** changed the name of the channel: **${oldChannel.name}** to **${newChannel.name}**.`;
                        } else if (oldChannel.nsfw !== newChannel.nsfw) {
                            tagName = 'Channel nsfw changed';
                            tagValue = `\`\`\`js\nOld nsfw: ${oldChannel.nsfw}\nNew nsfw: ${newChannel.nsfw}\`\`\``;
                            fieldComment = `\`\`\`js\nExecutor ID: ${executor.id}\nChannel ID: ${newChannel.id}\`\`\``;
                            desc = `**${executor.tag}** changed the nsfw of the channel: **${oldChannel.name}** to **${newChannel.nsfw}**.`;
                        } else if (
                            oldChannel.rateLimitPerUser !==
                            newChannel.rateLimitPerUser
                        ) {
                            tagName = 'Channel slowmode changed';
                            tagValue = `\`\`\`js\nOld slowmode: ${oldChannel.rateLimitPerUser} second(s)\nNew slowmode: ${newChannel.rateLimitPerUser}second(s)\`\`\``;
                            fieldComment = `\`\`\`js\nExecutor ID: ${executor.id}\nChannel ID: ${newChannel.id}\`\`\``;
                            desc = `**${executor.tag}** changed the slowmode of the channel: **${oldChannel.name}** to **${newChannel.rateLimitPerUser}**second(s).`;
                        } else if (oldChannel.parent !== newChannel.parent) {
                            tagName = 'Channel parent changed';
                            tagValue = `\`\`\`js\nOld parent: ${oldChannel.parent.name}\nNew parent: ${newChannel.parent.name}\`\`\``;
                            fieldComment = `\`\`\`js\nExecutor ID: ${executor.id}\nChannel ID: ${newChannel.id}\`\`\``;
                            desc = `**${executor.tag}** changed the parent of the channel: **${oldChannel.name}** to **${newChannel.parent}**.`;
                        } else if (
                            oldChannel.permissionOverwrites !==
                            newChannel.permissionOverwrites
                        ) {
                            // get all old roles and new roles names
                            let oldRoles = [];
                            let newRoles = [];
                            let name;
                            // get role name from id
                            oldChannel.permissionOverwrites.cache.forEach(
                                (role) => {
                                    name = oldChannel.guild.roles.cache.get(
                                        role.id
                                    ).name;
                                    oldRoles.push(name);
                                }
                            );
                            newChannel.permissionOverwrites.cache.forEach(
                                (role) => {
                                    name = newChannel.guild.roles.cache.get(
                                        role.id
                                    ).name;
                                    newRoles.push(name);
                                }
                            );

                            tagName = 'Channel permission overwrites changed';
                            tagValue = `\`\`\`js\nOld permission overwrites: ${oldRoles}\nNew permission overwrites: ${newRoles}\`\`\``;
                            fieldComment = `\`\`\`js\nExecutor ID: ${executor.id}\nChannel ID: ${newChannel.id}\`\`\``;
                            desc = `**${executor.tag}** changed the permission overwrites of the channel: **${oldChannel.name}**.`;
                        }

                        color = colors[data.color.toLowerCase()];
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: `Executor> ${executor.tag}`,
                                iconURL: executor.avatarURL(),
                            })
                            .setColor(color)
                            .setTitle(`LOG: ${tagName}`)
                            .setDescription(desc)
                            .addFields(
                                {
                                    name: 'Changes',
                                    value: tagValue,
                                },
                                {
                                    name: 'All IDs',
                                    value: fieldComment,
                                }
                            )
                            .setTimestamp()
                            .setFooter({
                                text: `by PhearionNetwork. Sever: ${oldChannel.guild.name}`,
                                iconURL: client.user.avatarURL(),
                            });
                        await logger.send({ embeds: [embed] });
                    }
                } else {
                    return;
                }
            });
        } catch (e) {}
    }
);
