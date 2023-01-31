import {Event} from "../structures/Event";
import {client} from "../index";
import {Message, EmbedBuilder, AuditLogEvent, TextChannel, Channel} from "discord.js";
const LG = require("../assets/models/logger.js");


export default new Event('messageDelete', async (message: Message) => {

    if (!message.guild) return;

    try {
        LG.findOne({
                serverId: message.guild.id
            },
            async (err, data) => {
                if (data) {
                    const channelId = data.logChannel;
                    let color = data.color;
                    const logger: Channel = client.channels.cache.find(c => `<#${c.id}>` === channelId);


                    if (logger !== undefined) {
                        if (!message.guild) return;
                        const fetchedLogs = await message.guild.fetchAuditLogs({
                            limit: 1,
                            type: AuditLogEvent.MessageDelete,
                        });
                        const deletionLog = fetchedLogs.entries.first();
                        const {executor, target} = deletionLog;

                        // embeding
                        let desc;
                        let action_author;
                        if (target.id === message.author.id) {
                            desc = `**${executor.tag}** deleted a message from: **${message.author.tag}**.`
                            action_author = executor.id;
                        }
                        else {
                            desc = `A message from: **${message.author.tag}** has been deleted but by who???.`
                            action_author = "Unknown";
                        }

                        color = color.charAt(0).toUpperCase() + color.slice(1).toLowerCase();
                        const deleteLog = new EmbedBuilder()
                            .setAuthor({ name: `Target> ${message.author.tag}`, iconURL: message.author.avatarURL() })
                            .setTitle('LOG: Deleted Message')
                            .setDescription(desc)
                            .addFields(
                                {name: 'Channel TAG', value: `<#${message.channel.id}>`},
                                {name: 'Message', value: `> ${message}`},
                                {
                                    name: 'All IDs', value: `\`\`\`js\nExecutor ID: ${action_author}\nTarget ID: ${message.author.id}\nChannel ID: ${message.channel.id}\`\`\``
                                }
                            )
                            .setColor(color)
                            .setTimestamp()
                            .setFooter({ text: `by Iris logs. Sever: ${message.guild.name}`, iconURL: client.user.displayAvatarURL() });

                        console.log("sending");
                        await (logger as TextChannel).send({embeds: [deleteLog]});

                    }

                }

            }
        )
    } catch (error) {
        // do nothing
    }


});