"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlashCommand_1 = require("../../../../structures/SlashCommand");
const WDB = require("../../../../assets/utils/models/welcome.js");
const { nextStep } = require("./src/setter/setCustom");
exports.default = new SlashCommand_1.SlashCommand({
    name: 'configure',
    description: 'Configure welcome message for the server',
    userPermissions: ['Administrator'],
    run: async ({ interaction }) => {
        let data = await WDB.findOne({
            server_id: `${interaction.guild.id}`
        });
        if (!data) {
            await new WDB({
                server_id: `${interaction.guild.id}`,
                channel_id: "0",
                theme: -1,
                color: "#000000"
            }).save();
            data = await WDB.findOne({
                server_id: `${interaction.guild.id}`
            });
            await nextStep(data, interaction);
        }
        else {
            await nextStep(data, interaction);
        }
    }
});
