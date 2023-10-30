import type {
    TextChannel,
    ColorResolvable} from 'discord.js';
import {
    EmbedBuilder,
} from 'discord.js';
import colors from '../../assets/data/canvasColors.json' assert { type: 'json' };
import LoggerModel from '../../assets/utils/models/Logger';
import { Event } from '../../structures/Event';
import type { ILoggerDocument } from '../../typings/MongoTypes';

export default new Event(
    'messageUpdate',
    async (client, oldMessage, newMessage) => {
        if (!oldMessage.guild) return;
        if (!oldMessage.author) return;
        if (oldMessage.author.bot) return;

        const data = await LoggerModel.findOne<ILoggerDocument>({
            serverId: oldMessage.guild.id,
        });

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
            const logger = (await client.channels.fetch(
                channelId
            )) as TextChannel;

            if (logger !== undefined) {
                if (!oldMessage.guild) return;

                // perform a coherence check to make sure that there's *something*
                if (!oldMessage) return;

                // embeding
                const actionAuthor = oldMessage.author.id;
                const desc = `A [message](https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id}) from: **${oldMessage.author.tag}** has been edited.`;

                const colorName = data.color.toLowerCase() as keyof typeof colors;
                color = colors[colorName];
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `Executor> ${oldMessage.author.tag}`,
                        iconURL: oldMessage.author.avatarURL() as string,
                    })
                    .setTitle('LOG: Edited Message')
                    .setDescription(desc)
                    .addFields(
                        {
                            name: 'Channel TAG',
                            value: `<#${oldMessage.channel.id}>`,
                        },
                        { name: 'Old Message', value: `${oldMessage.content}` },
                        { name: 'New Message', value: `${newMessage.content}` },
                        {
                            name: 'All IDs',
                            value: `\`\`\`js\nExecutor ID: ${actionAuthor}\nChannel ID: ${oldMessage.channel.id}\nMessage ID: ${oldMessage.id}\`\`\``,
                        }
                    )
                    .setColor(color as ColorResolvable)
                    .setTimestamp();
                await logger.send({ embeds: [embed] });
            }
        }

    }
);
