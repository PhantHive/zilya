import {Event} from "../../structures/Event";
import {client} from "../../index";
import {Message, EmbedBuilder, AuditLogEvent, TextChannel, Channel} from "discord.js";
const LG = require("../../assets/utils/models/logger.js");
import colors from "../../assets/data/colors.json";

export default new Event('messageUpdate', async (oldMessage: Message, newMessage: Message) => {

        if (!oldMessage.guild) return;

        let data = await LG.findOne({
            serverId: oldMessage.guild.id
        });
        new Promise(async (resolve) => {
            if (data) {

                const channelId = data.logChannel;
                let color = data.color;
                // find the channel by id using client.channels.fetch()
                const logger = await client.channels.fetch(channelId) as TextChannel;

                if (logger !== undefined) {
                    if (!oldMessage.guild) return;


                    // perform a coherence check to make sure that there's *something*
                    if (!oldMessage) return console.log(`A message by ${oldMessage.author.tag} was edited, but no relevant audit logs were found.`);

                    // embeding
                    let desc;
                    let action_author;
                    desc = `A [message](https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id}) from: **${oldMessage.author.tag}** has been edited.`
                    action_author = oldMessage.author.id;


                    color = colors[data.color.toLowerCase()];
                    const embed = new EmbedBuilder()
                        .setAuthor({ name: `Executor> ${oldMessage.author.tag}`, iconURL: oldMessage.author.avatarURL() })
                        .setTitle('LOG: Edited Message')
                        .setDescription(desc)
                        .addFields(
                            {name: 'Channel TAG', value: `<#${oldMessage.channel.id}>`},
                            {name: 'Old Message', value: `> ${oldMessage}`},
                            {name: 'New Message', value: `> ${newMessage}`},
                            {
                                name: 'All IDs', value: `\`\`\`js\nExecutor ID: ${action_author}\nChannel ID: ${oldMessage.channel.id}\nMessage ID: ${oldMessage.id}\`\`\``
                            }
                        )
                        .setColor(color)
                        .setTimestamp()
                    await logger.send({ embeds: [embed] });
                }

            }
        })

})