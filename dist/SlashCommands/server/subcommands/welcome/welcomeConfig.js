"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const SlashCommand_1 = require("../../../../structures/SlashCommand");
const MongoTypes_1 = tslib_1.__importDefault(require("../../../../typings/MongoTypes"));
const setCustom_1 = require("./src/setter/setCustom");
const configureWelcomeCommand = new SlashCommand_1.SlashCommand({
    name: 'configure',
    description: 'Configure welcome message for the server',
    userPermissions: ['Administrator'],
    run: async ({ interaction }) => {
        let data = await MongoTypes_1.default.WelcomeModel.findOne({
            serverId: `${interaction.guild.id}`
        });
        if (!data) {
            await new MongoTypes_1.default.WelcomeModel({
                serverId: `${interaction.guild.id}`,
                channelId: "0",
                theme: -1,
                color: "#000000"
            }).save();
            data = await MongoTypes_1.default.WelcomeModel.findOne({
                serverId: `${interaction.guild.id}`
            });
            await (0, setCustom_1.nextStep)(data, interaction);
        }
        else {
            await (0, setCustom_1.nextStep)(data, interaction);
        }
    }
});
exports.default = configureWelcomeCommand;
