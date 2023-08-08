"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const SlashCommand_1 = require("../../../../structures/SlashCommand");
const MongoTypes_1 = tslib_1.__importDefault(require("../../../../typings/MongoTypes"));
const removeLoggerCommand = new SlashCommand_1.SlashCommand({
    name: 'remove',
    description: 'Remove logger for the server',
    userPermissions: ['Administrator'],
    run: async ({ interaction }) => {
        // remove logger
        // find logger in database
        let data = await MongoTypes_1.default.LoggerModel.findOne({
            serverId: interaction.guild.id
        });
        new Promise(async (resolve) => {
            if (!data) {
                await interaction.reply({
                    content: 'Logger is not configured for this server.',
                    ephemeral: true
                });
            }
            else {
                new Promise(async (resolve) => {
                    await MongoTypes_1.default.LoggerModel.findOneAndDelete({
                        serverId: interaction.guild.id
                    });
                    await interaction.reply({
                        content: 'Logger has been removed.',
                        ephemeral: true
                    });
                })
                    .catch((err) => {
                    console.log(err);
                    interaction.reply({ content: 'An error occurred.', ephemeral: true });
                });
            }
        })
            .catch((err) => {
            console.log(err);
            interaction.reply({ content: 'An error occurred.', ephemeral: true });
        });
    }
});
exports.default = removeLoggerCommand;
