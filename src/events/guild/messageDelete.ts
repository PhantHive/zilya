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
import Models from '../../typings/MongoTypes';
import colors from '../../assets/data/canvasColors.json';

export default new Event('messageDelete', async (message: Message) => {
    if (!message.guild) return;

    let data = await Models.LoggerModel.findOne({
        serverId: message.guild.id,
    });

    if (!data) {
        return;
    }
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
                if (!message.guild) return;

                // fetch the audit logs for deletions
                const fetchedLogs = await message.guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.MessageDelete,
                });
                // since there's only 1 audit log entry in this collection, grab the first one
                const deletionLog = fetchedLogs.entries.first();
                // perform a coherence check to make sure that there's *something*
                if (!deletionLog)
                    return console.log(
                        `A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`
                    );
                const { executor, target } = deletionLog;

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

                color = colors[data.color.toLowerCase()];
                const deleteLog = new EmbedBuilder()
                    .setAuthor({
                        name: `Target> ${message.author.tag}`,
                        iconURL: message.author.avatarURL(),
                    })
                    .setTitle('LOG: Deleted Message')
                    .setDescription(desc)
                    .addFields(
                        {
                            name: 'Channel TAG',
                            value: `<#${message.channel.id}>`,
                        },
                        { name: 'Message', value: `> ${message}` },
                        {
                            name: 'All IDs',
                            value: `\`\`\`js\nExecutor ID: ${actionAuthor}\nTarget ID: ${message.author.id}\nChannel ID: ${message.channel.id}\`\`\``,
                        }
                    )
                    .setColor(color)
                    .setTimestamp()
                    .setFooter({
                        text: `by PhearionNetwork. Sever: ${message.guild.name}`,
                        iconURL: client.user.displayAvatarURL(),
                    });

                await (logger as TextChannel).send({ embeds: [deleteLog] });
            }
        }
    })
});
