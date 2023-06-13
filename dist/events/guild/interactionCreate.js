"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
const Event_1 = require("../../structures/Event");
const { setChannelId, setTheme, setColor } = require("../../SlashCommands/server/subcommands/welcome/src/setter/setCustom");
const { setEdit } = require("../../SlashCommands/server/subcommands/welcome/src/setter/setEdit");
const WDB = require("../../assets/utils/models/welcome.js");
exports.default = new Event_1.Event('interactionCreate', async (interaction) => {
    if (interaction.isStringSelectMenu()) {
        // ================
        // WELCOME SYSTEM
        // ================
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
        }
        // setter
        if (interaction.customId === "channel_id") {
            await setChannelId(data, interaction);
        }
        else if (interaction.customId === "theme") {
            await setTheme(data, interaction);
        }
        else if (interaction.customId === "color") {
            await setColor(data, interaction);
        }
        // selector
        else if (interaction.customId === "edit_welcome") {
            // get value that need to be edited
            const value = interaction.values[0];
            await setEdit(data, interaction, value);
        }
    }
    else if (interaction.isButton()) {
        // ================
        // WELCOME SYSTEM
        // ================
        // check if customId is welcome_remove_yes
        if (interaction.customId === "welcome_remove_yes") {
            // remove the welcome message
            await WDB.findOneAndDelete({
                server_id: `${interaction.guild.id}`
            });
            // send a confirmation message
            await interaction.update({
                content: "Welcome message has been removed.",
                components: []
            });
        }
        else if (interaction.customId === "welcome_remove_no") {
            // send a confirmation message
            await interaction.update({
                content: "Welcome message removal has been cancelled.",
                components: []
            });
        }
    }
    if (!interaction.isCommand())
        return;
    const command = index_1.client.commands.get(interaction.commandName);
    if (!command)
        return;
    await command.run({
        args: interaction.options,
        client: index_1.client,
        interaction: interaction
    });
});
