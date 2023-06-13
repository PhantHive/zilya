"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Event_1 = require("../../structures/Event");
const index_1 = require("../../index");
const discord_js_1 = require("discord.js");
const LG = require("../../assets/utils/models/logger.js");
const colors_json_1 = tslib_1.__importDefault(require("../../assets/data/colors.json"));
// function promises to send embeds to the log channel
function sendEmbed(logger, data, color, executor, tagName, tagValue, fieldComment, desc, changeName, oldRole) {
    return new Promise(async (resolve) => {
        color = colors_json_1.default[data.color.toLowerCase()];
        const embed = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: `Executor> ${executor.tag}`, iconURL: executor.displayAvatarURL() })
            .setTitle(tagName)
            .setDescription(desc)
            .setColor(color)
            .addFields({
            name: changeName,
            value: tagValue,
            inline: false
        }, {
            name: "All IDs",
            value: fieldComment,
            inline: false
        })
            .setTimestamp()
            .setFooter({ text: `by PhearionNetwork. Sever: ${oldRole.guild.name}`, iconURL: index_1.client.user.displayAvatarURL() });
        await logger.send({ embeds: [embed] });
        resolve(true);
    });
}
exports.default = new Event_1.Event('roleUpdate', async (oldRole, newRole) => {
    if (!oldRole.guild)
        return;
    let data = await LG.findOne({
        serverId: oldRole.guild.id
    });
    new Promise(async (resolve) => {
        if (data) {
            const channelId = data.logChannel;
            let color = data.color;
            // find the channel by id using client.channels.fetch()
            const logger = await index_1.client.channels.fetch(channelId);
            if (logger !== undefined) {
                const fetchedLogs = await oldRole.guild.fetchAuditLogs({
                    limit: 1,
                    type: discord_js_1.AuditLogEvent.RoleCreate,
                });
                // since there's only 1 audit log entry in this collection, grab the first one
                const roleUpdateLog = fetchedLogs.entries.first();
                // grab the user object of the person who made the changes
                const { executor } = roleUpdateLog;
                let fieldComment;
                let tagValue;
                let tagName;
                let desc;
                let changeName;
                let oldPerms = oldRole.permissions.toArray();
                let newPerms = newRole.permissions.toArray();
                if (oldRole.name !== newRole.name) {
                    changeName = "Name";
                    tagName = "Role name changed";
                    tagValue = `\`\`\`js\nOld name: ${oldRole.name}\nNew name: ${newRole.name}\`\`\``;
                    fieldComment = `\`\`\`js\nRole ID: ${newRole.id}\nExecutor ID: ${executor.id}\`\`\``;
                    desc = `**${executor.tag}** changed the name of the role: **${oldRole.name}** to **${newRole.name}**.`;
                    await sendEmbed(logger, data, color, executor, tagName, tagValue, fieldComment, desc, changeName, oldRole);
                }
                if (oldRole.hexColor !== newRole.hexColor) {
                    changeName = "Color";
                    tagName = "Role color changed";
                    tagValue = `\`\`\`js\nOld color: ${oldRole.hexColor}\nNew color: ${newRole.hexColor}\`\`\``;
                    fieldComment = `\`\`\`js\nRole ID: ${newRole.id}\nExecutor ID: ${executor.id}\`\`\``;
                    desc = `**${executor.tag}** changed the color of the role: **${oldRole.hexColor}** to **${newRole.hexColor}**.`;
                    await sendEmbed(logger, data, color, executor, tagName, tagValue, fieldComment, desc, changeName, oldRole);
                }
                if (oldRole.hoist !== newRole.hoist) {
                    changeName = "Hoist";
                    tagName = "Role hoist changed";
                    tagValue = `\`\`\`js\nOld hoist: ${oldRole.hoist}\nNew hoist: ${newRole.hoist}\`\`\``;
                    fieldComment = `\`\`\`js\nRole ID: ${newRole.id}\nExecutor ID: ${executor.id}\`\`\``;
                    desc = `**${executor.tag}** changed the hoist of the role: **${oldRole.hoist}** to **${newRole.hoist}**.`;
                    await sendEmbed(logger, data, color, executor, tagName, tagValue, fieldComment, desc, changeName, oldRole);
                }
                if (oldRole.mentionable !== newRole.mentionable) {
                    changeName = "Mentionable";
                    tagName = "Role mentionable changed";
                    tagValue = `\`\`\`js\nOld mentionable: ${oldRole.mentionable}\nNew mentionable: ${newRole.mentionable}\`\`\``;
                    fieldComment = `\`\`\`js\nRole ID: ${newRole.id}\nExecutor ID: ${executor.id}\`\`\``;
                    desc = `**${executor.tag}** changed the mentionable of the role: **${oldRole.mentionable}** to **${newRole.mentionable}**.`;
                    await sendEmbed(logger, data, color, executor, tagName, tagValue, fieldComment, desc, changeName, oldRole);
                }
                // check if new permissions are added or removed
                if (oldPerms.length < newPerms.length) {
                    changeName = "Added permissions";
                    tagName = "Role permissions changed (added)";
                    let addedPerms = newPerms.filter((perm) => !oldPerms.includes(perm)).map((perm) => `🟢 ${perm}`);
                    tagValue = `\`\`\`js\n${addedPerms.join("\n")}\`\`\``;
                    fieldComment = `\`\`\`js\nRole ID: ${newRole.id}\nExecutor ID: ${executor.id}\`\`\``;
                    desc = `**${executor.tag}** added a/multiple permission(s) on **${oldRole.name}** role`;
                    await sendEmbed(logger, data, color, executor, tagName, tagValue, fieldComment, desc, changeName, oldRole);
                }
                if (oldPerms.length > newPerms.length) {
                    changeName = "Removed permissions";
                    tagName = "Role permissions changed (removed)";
                    let removedPerms = oldPerms.filter((perm) => !newPerms.includes(perm)).map((perm) => `🔻 ${perm}`);
                    tagValue = `\`\`\`js\n${removedPerms.join("\n")}\`\`\``;
                    fieldComment = `\`\`\`js\nRole ID: ${newRole.id}\nExecutor ID: ${executor.id}\`\`\``;
                    desc = `**${executor.tag}** removed a/multiple permission(s) on **${oldRole.name}** role`;
                    await sendEmbed(logger, data, color, executor, tagName, tagValue, fieldComment, desc, changeName, oldRole);
                }
            }
        }
    });
});
