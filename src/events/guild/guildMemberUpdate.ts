import {Event} from "../../structures/Event";
import {client} from "../../index";
import {AuditLogEvent, EmbedBuilder, TextChannel} from "discord.js";
import colors from "../../assets/data/colors.json";

const LG = require("../../assets/models/logger.js");

function sendEmbed(logger, data, color, executor, tagName, tagValue, fieldComment, desc, changeName, oldRole) {

    return new Promise(async (resolve) => {
        color = colors[data.color.toLowerCase()];
        const embed = new EmbedBuilder()
            .setAuthor({ name: `Executor> ${executor.tag}`, iconURL: executor.displayAvatarURL() })
            .setTitle(tagName)
            .setDescription(desc)
            .setColor(color)
            .addFields(
                {
                    name: changeName,
                    value: tagValue,
                    inline: false
                },
                {
                    name: "All IDs",
                    value: fieldComment,
                    inline: false
                }
            )
            .setTimestamp()
            .setFooter({ text: `by PhearionNetwork. Sever: ${oldRole.guild.name}`, iconURL: client.user.displayAvatarURL() });

        await logger.send({embeds: [embed]});
        resolve(true);
    });

}

export default new Event('guildMemberUpdate', async (oldMember, newMember) => {

        if (!oldMember.guild) return;

        let data = await LG.findOne({
            serverId: newMember.guild.id
        });
        new Promise(async (resolve) => {
            let color = data.color;
            const channelId = data.logChannel;
            // find the channel by id using client.channels.fetch()
            const logger = await client.channels.fetch(channelId) as TextChannel;

            if (logger !== undefined) {

                const fetchedLogs = await oldMember.guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.MemberRoleUpdate,
                });
                // since there's only 1 audit log entry in this collection, grab the first one
                const roleUpdateLog = fetchedLogs.entries.first();
                // grab the user object of the person who made the changes
                const { executor, target } = roleUpdateLog;

                // if this wasnt a role update, return
                if (!roleUpdateLog) return;

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

        });
});