"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Event_1 = require("../../structures/Event");
const index_1 = require("../../index");
const discord_js_1 = require("discord.js");
const MongoTypes_1 = tslib_1.__importDefault(require("../../typings/MongoTypes"));
const colors_json_1 = tslib_1.__importDefault(require("../../assets/data/colors.json"));
exports.default = new Event_1.Event('roleDelete', async (role) => {
    if (!role.guild)
        return;
    let data = await MongoTypes_1.default.LoggerModel.findOne({
        serverId: role.guild.id
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
                const fetchedLogs = await role.guild.fetchAuditLogs({
                    limit: 1,
                    type: discord_js_1.AuditLogEvent.RoleCreate,
                });
                // since there's only 1 audit log entry in this collection, grab the first one
                const deletionLog = fetchedLogs.entries.first();
                // grab the user object of the person who deleted the role
                const { executor } = deletionLog;
                color = colors_json_1.default[data.color.toLowerCase()];
                let desc = `**${executor.tag}** deleted a role: **${role.name}**.`;
                let fieldComment = `\`\`\`js\nRole ID: ${role.id}\nExecutor ID: ${executor.id} \`\`\``;
                const embed = new discord_js_1.EmbedBuilder()
                    .setAuthor({ name: `Executor> ${executor.tag}`, iconURL: executor.displayAvatarURL() })
                    .setTitle(`LOG: Role Deleted  📤`)
                    .setDescription(desc)
                    .setColor(color)
                    .addFields({
                    name: `Role Name`,
                    value: `${role.name}`,
                    inline: true
                }, {
                    name: `Role Color`,
                    value: `${role.hexColor}`,
                    inline: true
                }, {
                    name: `Role Position`,
                    value: `${role.position}`,
                    inline: true
                }, {
                    name: `All IDs`,
                    value: fieldComment
                })
                    .setTimestamp()
                    .setFooter({ text: `by PhearionNetwork. Sever: ${role.guild.name}`, iconURL: index_1.client.user.displayAvatarURL() });
                // send the embed to the channel
                await logger.send({ embeds: [embed] });
            }
        }
    });
});
