"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const SlashCommand_1 = require("../../../../structures/SlashCommand");
const MongoTypes_1 = tslib_1.__importDefault(require("../../../../typings/MongoTypes"));
const promises_1 = require("node:timers/promises");
const selectEdit_1 = require("./src/selector/selectEdit");
const editWelcomeCommand = new SlashCommand_1.SlashCommand({
    name: 'edit',
    description: 'Edit welcome message for the server',
    userPermissions: ['Administrator'],
    run: async ({ interaction }) => {
        new Promise(async (resolve, reject) => {
            let data = await MongoTypes_1.default.WelcomeModel.findOne({
                serverId: `${interaction.guild.id}`
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
            await (0, selectEdit_1.editOptions)(interaction);
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
exports.default = editWelcomeCommand;
