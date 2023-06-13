"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlashCommand_1 = require("../../../../structures/SlashCommand");
const WDB = require("../../../../assets/utils/models/welcome.js");
const promises_1 = require("node:timers/promises");
const { editOptions } = require("./src/selector/selectEdit");
exports.default = new SlashCommand_1.SlashCommand({
    name: 'edit',
    description: 'Edit welcome message for the server',
    userPermissions: ['Administrator'],
    run: async ({ interaction }) => {
        new Promise(async (resolve, reject) => {
            let data = await WDB.findOne({
                server_id: `${interaction.guild.id}`
            });
            if (!data) {
                reject("Welcome message has not been configured. Please configure one first with `/welcome configure`.");
            }
            else {
                resolve("Welcome message can be edited now. Proceeding to edit options...");
            }
        })
            .then(async (res) => {
            await interaction.reply({
                content: res
            });
            await (0, promises_1.setTimeout)(3000);
            await editOptions(interaction);
        })
            .catch(async (err) => {
            await interaction.reply({
                content: err
            })
                .catch(async () => {
                await interaction.editReply({
                    content: "An error occurred. Please try again."
                });
            });
        });
    }
});
