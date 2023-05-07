import {Event} from "../../structures/Event";
import {client} from "../../index";
import {Message, EmbedBuilder, AuditLogEvent, TextChannel, Channel} from "discord.js";
const LG = require("../../assets/utils/models/logger.js");
import colors from "../../assets/data/colors.json";

export default new Event('messageDelete', async (message: Message) => {

    if (!message.guild) return;


    let data = await LG.findOne({
            serverId: message.guild.id
        });
    new Promise(async (resolve) => {
            if (data) {
                const channelId = data.logChannel;
                let color = data.color;
                // find the channel by id using client.channels.fetch()
                const logger = await client.channels.fetch(channelId) as TextChannel;

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
                    if (!deletionLog) return console.log(`A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`);
                    const {executor, target} = deletionLog;

                    // embeding
                    let desc;
                    let action_author;
                    if (target.id === message.author.id) {
                        desc = `**${executor.tag}** deleted a message from: **${message.author.tag}**.`
                        action_author = executor.id;
                    }
                    else {
                        desc = `A message from: **${message.author.tag}** has been deleted.`
                        action_author = "Unknown";
                    }

                    color = colors[data.color.toLowerCase()];
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
                        .setFooter({ text: `by PhearionNetwork. Sever: ${message.guild.name}`, iconURL: client.user.displayAvatarURL() });

                    console.log("sending");
                    await (logger as TextChannel).send({embeds: [deleteLog]});

                }

            }

        }
    )
        .catch((err: any) => {
            console.log(err);
        });



});