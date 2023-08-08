"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Event_1 = require("../../structures/Event");
const index_1 = require("../../index");
const discord_js_1 = require("discord.js");
const MongoTypes_1 = tslib_1.__importDefault(require("../../typings/MongoTypes"));
const colors_json_1 = tslib_1.__importDefault(require("../../assets/data/colors.json"));
exports.default = new Event_1.Event('messageUpdate', async (oldMessage, newMessage) => {
    if (!oldMessage.guild)
        return;
    if (oldMessage.author.bot)
        return;
    let data = await MongoTypes_1.default.LoggerModel.findOne({
        serverId: oldMessage.guild.id
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
                if (!oldMessage.guild)
                    return;
                // perform a coherence check to make sure that there's *something*
                if (!oldMessage)
                    return console.log(`A message by ${oldMessage.author.tag} was edited, but no relevant audit logs were found.`);
                // embeding
                let desc;
                let actionAuthor;
                desc = `A [message](https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id}) from: **${oldMessage.author.tag}** has been edited.`;
                actionAuthor = oldMessage.author.id;
                color = colors_json_1.default[data.color.toLowerCase()];
                const embed = new discord_js_1.EmbedBuilder()
                    .setAuthor({ name: `Executor> ${oldMessage.author.tag}`, iconURL: oldMessage.author.avatarURL() })
                    .setTitle('LOG: Edited Message')
                    .setDescription(desc)
                    .addFields({ name: 'Channel TAG', value: `<#${oldMessage.channel.id}>` }, { name: 'Old Message', value: `${oldMessage}` }, { name: 'New Message', value: `${newMessage}` }, {
                    name: 'All IDs', value: `\`\`\`js\nExecutor ID: ${actionAuthor}\nChannel ID: ${oldMessage.channel.id}\nMessage ID: ${oldMessage.id}\`\`\``
                })
                    .setColor(color)
                    .setTimestamp();
                await logger.send({ embeds: [embed] });
            }
        }
    });
});
