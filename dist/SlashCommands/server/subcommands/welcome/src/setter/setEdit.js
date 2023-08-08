"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setCustom_1 = require("./setCustom");
const setEdit = async (data, interaction, value) => {
    new Promise(async (resolve, reject) => {
        if (!data) {
            // just send a message that welcome message has not been configured
            reject("Welcome message has been removed while the edit process was on going. Please configure one first with `/welcome configure`.");
        }
        else {
            // set the value to default
            if (value === "edit_channel_id") {
                data.channelId = "0";
                data.save();
                await (0, setCustom_1.nextStep)(data, interaction);
            }
            else if (value === "edit_theme") {
                data.theme = -1;
                data.save();
                await (0, setCustom_1.nextStep)(data, interaction);
            }
            else if (value === "edit_color") {
                data.color = "#000000";
                data.save();
                await (0, setCustom_1.nextStep)(data, interaction);
            }
        }
    })
        .then(async () => {
        await interaction.reply({
            content: "Welcome message has been edited successfully."
        });
    });
};
module.exports = {
    setEdit
};
