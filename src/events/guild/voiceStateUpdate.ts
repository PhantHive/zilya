import {Event} from "../../structures/Event";
import {client} from "../../index";
import {Message, EmbedBuilder, AuditLogEvent, TextChannel, Channel, VoiceState} from "discord.js";
const LG = require("../../assets/utils/models/logger.js");
import colors from "../../assets/data/colors.json";
const RDB = require("../../assets/utils/models/rank.js");

const updateRank = async (newState, timer) => {

    // check if rank exists in db
    let data = await RDB.findOne({
        server_id: `${newState.guild.id}`,
        user_id: `${newState.member.user.id}`
    });

    new Promise(async (resolve, reject) => {
        if (!data) {
            // check number of doc in db to set rank
            const nbMembers: number = await RDB.countDocuments({
                server_id: `${newState.guild.id}`
            });

            await new RDB({
                server_id: `${newState.guild.id}`,
                user_id: `${newState.member.user.id}`,
                xp_msg: 0,
                level_msg: 1,
                rank_msg: nbMembers + 1,
                xp_vocal: 0,
                level_vocal: 1,
                rank_vocal: nbMembers + 1
            }).save();

            data = await RDB.findOne({
                server_id: `${newState.guild.id}`,
                user_id: `${newState.member.user.id}`
            });
            resolve(data);
        }
        else {
            resolve(data);
        }
    })
        .then(async (data: any) => {
            // console log xp and level before update
            console.log(`xp: ${data.xp_vocal} | level: ${data.level_vocal}`);

            // = 25 * (curLvl ^ 2) + 15 * curLvl + 25 = nextLvlXp
            // xp win: 2*(min)
            const nextLvlXp = 25 * (data.level_vocal ** 2) + 15 * data.level_vocal + 25;

            // if user has enough xp to level up
            if (data.xp_vocal >= nextLvlXp) {
                data.level_vocal += 1;
                data.xp_vocal = 0;
                await data.save();
            }
            else {
                // take xp like 2 times the time spent in the channel in minutes
                data.xp_vocal += 2 * timer;
                await data.save();
            }

            // compare all users in the server and sort them by xp_vocal and level_vocal then update rank_vocal
            const users = await RDB.find({
                server_id: `${newState.guild.id}`
            }).sort([
                ['xp_vocal', 'descending'],
                ['level_vocal', 'descending']
            ]).exec();

            for (let i = 0; i < users.length; i++) {
                users[i].rank_vocal = i + 1;
                await users[i].save();
            }

            // console log xp and level after update
            console.log(`xp: ${data.xp_vocal} | level: ${data.level_vocal}`);

        })

}

export default new Event('voiceStateUpdate', async (oldState: VoiceState, newState: VoiceState) => {

    if (!oldState.guild) return;
    if (oldState.member.user.bot) return;

    // xp system
    let timer: number = null;

    if (newState.channelId && !oldState.channelId) {
        setInterval(async () => {
            if (!newState.channelId || ((newState.channelId !== oldState.channelId) && oldState.channelId)) return clearInterval(timer);
            timer++;
            await updateRank(newState, timer);
        }, 10000);
    }

    try {
        let data = await LG.findOne({
                serverId: oldState.guild.id
            })
        new Promise(async (resolve) => {
                if (data) {
                    const channelId = data.logChannel;
                    let color = data.color;
                    // find the channel by id using client.channels.fetch()
                    const logger = await client.channels.fetch(channelId) as TextChannel;

                    if (logger !== undefined && data.notifType !== "no_voice_logs") {
                        let memberState;
                        let channelId;
                        let fieldComment;
                        let tagValue;
                        let tagName;

                        if (newState.channelId && !oldState.channelId) {
                            memberState = "joined";
                            channelId = newState.channelId;

                        } else if (oldState.channelId && !newState.channelId) {
                            memberState = "left";
                            channelId = oldState.channelId;

                        } else if (oldState.channelId && newState.channelId) {

                            if (newState.selfMute && !oldState.selfMute) {
                                memberState = "muted"
                                tagValue = `<@${newState.member.user.id}> self muted in <#${newState.channelId}>`;
                                fieldComment =  `\`\`\`js\nExecutor ID: ${newState.id}\nChannel ID: ${newState.channelId}\`\`\``
                            }
                            else if (!newState.selfMute && oldState.selfMute) {
                                memberState = "unmuted"
                                tagValue = `<@${newState.member.user.id}> self unmuted in <#${newState.channelId}>`;
                                fieldComment =  `\`\`\`js\nExecutor ID: ${newState.id}\nChannel ID: ${newState.channelId}\`\`\``
                            }
                            else if (newState.selfVideo && !oldState.selfVideo) {
                                memberState = "camera ON"
                                tagValue = `<@${newState.member.user.id}> turned on the camera in <#${newState.channelId}>`;
                                fieldComment =  `\`\`\`js\nExecutor ID: ${newState.id}\nChannel ID: ${newState.channelId}\`\`\``
                            }
                            else if (!newState.selfVideo && oldState.selfVideo) {
                                memberState = "camera OFF"
                                tagValue = `<@${newState.member.user.id}> turned OFF the camera in <#${newState.channelId}>`;
                                fieldComment =  `\`\`\`js\nExecutor ID: ${newState.id}\nChannel ID: ${newState.channelId}\`\`\``
                            }
                            else if (newState.selfDeaf && !oldState.selfDeaf) {
                                memberState = "deafened"
                                tagValue = `<@${newState.member.user.id}> deafened in <#${newState.channelId}>`;
                                fieldComment =  `\`\`\`js\nExecutor ID: ${newState.id}\nChannel ID: ${newState.channelId}\`\`\``
                            }
                            else if (!newState.selfDeaf && oldState.selfDeaf) {
                                memberState = "undeafened"
                                tagValue = `<@${newState.member.user.id}> undeafened in <#${newState.channelId}>`;
                                fieldComment =  `\`\`\`js\nExecutor ID: ${newState.id}\nChannel ID: ${newState.channelId}\`\`\``
                            }
                            else if (newState.serverMute && !oldState.serverMute) {
                                memberState = "server muted"
                                tagValue = `<@${newState.member.user.id}> server muted in <#${newState.channelId}>`;
                                fieldComment =  `\`\`\`js\nExecutor ID: ${newState.id}\nChannel ID: ${newState.channelId}\`\`\``
                            }
                            else if (!newState.serverMute && oldState.serverMute) {
                                memberState = "server unmuted"
                                tagValue = `<@${newState.member.user.id}> server unmuted in <#${newState.channelId}>`;
                                fieldComment =  `\`\`\`js\nExecutor ID: ${newState.id}\nChannel ID: ${newState.channelId}\`\`\``
                            }
                            else if (newState.streaming && !oldState.streaming) {
                                memberState = "streaming"
                                tagValue = `<@${newState.member.user.id}> is streaming in <#${newState.channelId}>`;
                                fieldComment =  `\`\`\`js\nExecutor ID: ${newState.id}\nChannel ID: ${newState.channelId}\`\`\``
                            }
                            else if (newState.serverDeaf && !oldState.serverDeaf) {
                                memberState = "server deafened"
                                tagValue = `<@${newState.member.user.id}> server deafened in <#${newState.channelId}>`;
                                fieldComment =  `\`\`\`js\nExecutor ID: ${newState.id}\nChannel ID: ${newState.channelId}\`\`\``
                            }
                            else if (!newState.serverDeaf && oldState.serverDeaf) {
                                memberState = "server undeafened"
                                tagValue = `<@${newState.member.user.id}> server undeafened in <#${newState.channelId}>`;
                                fieldComment =  `\`\`\`js\nExecutor ID: ${newState.id}\nChannel ID: ${newState.channelId}\`\`\``
                            }
                            else if (!newState.streaming && oldState.streaming) {
                                memberState = "stopped streaming"
                                tagValue = `<@${newState.member.user.id}> stopped streaming in <#${newState.channelId}>`;
                                fieldComment =  `\`\`\`js\nExecutor ID: ${newState.id}\nChannel ID: ${newState.channelId}\`\`\``
                            }
                            else {
                                memberState = "switched"
                                tagValue = `from <#${oldState.channelId}> to <#${newState.channelId}>`;
                                fieldComment =  `\`\`\`js\nExecutor ID: ${newState.id}\nLast Channel ID: ${oldState.channelId}\nNew Channel ID: ${newState.channelId}\`\`\``
                            }

                        }

                        if (!fieldComment) {
                            fieldComment = `\`\`\`js\nExecutor ID: ${newState.id}\nChannel ID: ${channelId} \`\`\``
                            tagValue = `<#${channelId}>`
                        }
                        // embeding
                        color = colors[data.color.toLowerCase()];
                        const voiceLog = new EmbedBuilder()
                            .setAuthor({ name: `Executor> ${newState.member.user.tag}` })
                            .setTitle('LOG: Voice event')
                            .setDescription(`**${newState.member.user.tag}** ${memberState} in/a voice channel.`)
                            .addFields(
                                { name: "Voice channel TAG", value: tagValue },

                                {
                                    name: 'All IDs', value: fieldComment
                                }
                            )
                            .setColor(color)
                            .setTimestamp()
                            .setFooter({ text: `by PhearionNetwork. Sever: ${newState.guild.name}`, iconURL: client.user.displayAvatarURL() });
                        await logger.send({embeds: [voiceLog]});
                    }

                }

        });

    } catch (e) {
        console.error(e);
    }

});