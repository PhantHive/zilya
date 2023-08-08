"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Event_1 = require("../../structures/Event");
const index_1 = require("../../index");
const discord_js_1 = require("discord.js");
const MongoTypes_1 = tslib_1.__importDefault(require("../../typings/MongoTypes"));
const colors_json_1 = tslib_1.__importDefault(require("../../assets/data/colors.json"));
exports.default = new Event_1.Event('messageDelete', async (message) => {
    if (!message.guild)
        return;
    let data = await MongoTypes_1.default.LoggerModel.findOne({
        serverId: message.guild.id
    });
    new Promise(async (resolve) => {
        if (data) {
            const channelId = data.logChannel;
            let color;
            try {
                color = data.color;
            }
            catch (e) {
                // set to Random color
                color = "Random";
            }
            // find the channel by id using client.channels.fetch()
            const logger = await index_1.client.channels.fetch(channelId);
            if (logger !== undefined) {
                if (!message.guild)
                    return;
                // fetch the audit logs for deletions
                const fetchedLogs = await message.guild.fetchAuditLogs({
                    limit: 1,
                    type: discord_js_1.AuditLogEvent.MessageDelete,
                });
                // since there's only 1 audit log entry in this collection, grab the first one
                const deletionLog = fetchedLogs.entries.first();
                // perform a coherence check to make sure that there's *something*
                if (!deletionLog)
                    return console.log(`A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`);
                const { executor, target } = deletionLog;
                // embeding
                let desc;
                let actionAuthor;
                if (target.id === message.author.id) {
                    desc = `**${executor.tag}** deleted a message from: **${message.author.tag}**.`;
                    actionAuthor = executor.id;
                }
                else {
                    desc = `A message from: **${message.author.tag}** has been deleted.`;
                    actionAuthor = "Unknown";
                }
                color = colors_json_1.default[data.color.toLowerCase()];
                const deleteLog = new discord_js_1.EmbedBuilder()
                    .setAuthor({ name: `Target> ${message.author.tag}`, iconURL: message.author.avatarURL() })
                    .setTitle('LOG: Deleted Message')
                    .setDescription(desc)
                    .addFields({ name: 'Channel TAG', value: `<#${message.channel.id}>` }, { name: 'Message', value: `> ${message}` }, {
                    name: 'All IDs', value: `\`\`\`js\nExecutor ID: ${actionAuthor}\nTarget ID: ${message.author.id}\nChannel ID: ${message.channel.id}\`\`\``
                })
                    .setColor(color)
                    .setTimestamp()
                    .setFooter({ text: `by PhearionNetwork. Sever: ${message.guild.name}`, iconURL: index_1.client.user.displayAvatarURL() });
                await logger.send({ embeds: [deleteLog] });
            }
        }
    })
        .catch((err) => {
        console.log(err);
    });
});
