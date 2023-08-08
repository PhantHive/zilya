"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const SlashCommand_1 = require("../../../../structures/SlashCommand");
const discord_js_1 = require("discord.js");
const MongoTypes_1 = tslib_1.__importDefault(require("../../../../typings/MongoTypes"));
const removeWelcomeCommand = new SlashCommand_1.SlashCommand({
    name: 'remove',
    description: 'Remove welcome message for the server',
    userPermissions: ['Administrator'],
    run: async ({ interaction }) => {
        // find if there is data, if not say that there is nothing to remove otherwise send a confirmation button yes or no.
        // everything should be a Promise
        new Promise(async (resolve, reject) => {
            let data = await MongoTypes_1.default.WelcomeModel.findOne({
                serverId: `${interaction.guild.id}`
            });
            if (!data) {
                reject("There is no welcome message to remove.\nPlease configure one first with `/welcome configure`.");
            }
            else {
                resolve("Are you sure you want to remove the welcome message?");
            }
        })
            .then(async (res) => {
            // create an actionrowbuilder with a ❌ button and a ✅ button
            const actionRow = new discord_js_1.ActionRowBuilder()
                .addComponents(new discord_js_1.ButtonBuilder()
                .setCustomId("welcome_remove_yes")
                .setLabel("✅")
                .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                .setCustomId("welcome_remove_no")
                .setLabel("❌")
                .setStyle(discord_js_1.ButtonStyle.Secondary));
            // send the message
            await interaction.reply({
                content: res,
                components: [actionRow]
            });
        })
            .catch(async (err) => {
            await interaction.reply({
                content: err
            });
        });
    }
});
exports.default = removeWelcomeCommand;
