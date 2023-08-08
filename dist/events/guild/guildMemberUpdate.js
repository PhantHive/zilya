"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Event_1 = require("../../structures/Event");
const index_1 = require("../../index");
const discord_js_1 = require("discord.js");
const colors = require("../../assets/data/colors.json");
const MongoTypes_1 = tslib_1.__importDefault(require("../../typings/MongoTypes"));
function sendEmbed(logger, data, color, executor, tagName, tagValue, fieldComment, desc, changeName, oldRole) {
    return new Promise(async (resolve) => {
        color = colors[data.color.toLowerCase()];
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
exports.default = new Event_1.Event('guildMemberUpdate', async (oldMember, newMember) => {
    if (!oldMember.guild)
        return;
    if (oldMember.user.bot)
        return;
    let data = await MongoTypes_1.default.LoggerModel.findOne({
        serverId: newMember.guild.id
    });
    if (!data) {
        return;
    }
    else {
        let color = data.color;
        const channelId = data.logChannel;
        // find the channel by id using client.channels.fetch()
        const logger = await index_1.client.channels.fetch(channelId);
        if (logger !== undefined) {
            const fetchedLogs = await oldMember.guild.fetchAuditLogs({
                limit: 1,
                type: discord_js_1.AuditLogEvent.MemberRoleUpdate,
            });
            // since there's only 1 audit log entry in this collection, grab the first one
            const roleUpdateLog = fetchedLogs.entries.first();
            // grab the user object of the person who made the changes
            const { executor, target } = roleUpdateLog;
            // if this wasnt a role update, return
            if (!roleUpdateLog)
                return;
            let newRole;
            let tagName;
            let tagValue;
            let fieldComment;
            let desc;
            let changeName;
            if (oldMember.roles.cache.size < newMember.roles.cache.size) {
                newRole = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id)).first();
                tagName = "Role Added";
                tagValue = `🟢 ${newRole}`;
                fieldComment = `\`\`\`js\nMember: ${newMember.user.id}\nRole: ${newRole.id}\`\`\``;
                desc = `**${newMember.user.tag}** was given the **${newRole.name}** role.`;
                changeName = "Role Added";
                await sendEmbed(logger, data, color, executor, tagName, tagValue, fieldComment, desc, changeName, newMember);
            }
            else if (oldMember.roles.cache.size > newMember.roles.cache.size) {
                newRole = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id)).first();
                tagName = "Role Removed";
                tagValue = `🔴 ${newRole}`;
                fieldComment = `\`\`\`js\nMember: ${newMember.user.id}\nRole: ${newRole.id}\`\`\``;
                desc = `**${newMember.user.tag}** was removed from the **${newRole.name}** role.`;
                changeName = "Role Removed";
                await sendEmbed(logger, data, color, executor, tagName, tagValue, fieldComment, desc, changeName, newMember);
            }
            else if (oldMember.nickname !== newMember.nickname) {
                const newNickname = newMember.nickname ?? newMember.user.username;
                const oldNickname = oldMember.nickname ?? oldMember.user.username;
                tagName = "Nickname Changed";
                tagValue = `📝 ${oldNickname} ➡️ ${newNickname}`;
                fieldComment = `\`\`\`js\nMember: ${newMember.user.id}\`\`\``;
                desc = `**${newMember.user.tag}**'s nickname was changed.`;
                changeName = "Nickname Changed";
                await sendEmbed(logger, data, color, executor, tagName, tagValue, fieldComment, desc, changeName, newMember);
            }
        }
    }
});
