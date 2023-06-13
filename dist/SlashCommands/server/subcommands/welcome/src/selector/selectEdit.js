"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const editOptions = async (interaction) => {
    let actionRow = new discord_js_1.ActionRowBuilder()
        .addComponents(new discord_js_1.StringSelectMenuBuilder()
        .setCustomId("edit_welcome")
        .setPlaceholder("Choose an option")
        .addOptions({
        label: "Edit channel id",
        emoji: "📝",
        value: "edit_channel_id",
    }, {
        label: "Edit color",
        emoji: "🎨",
        value: "edit_color",
    }, {
        label: "Edit theme",
        emoji: "🦄",
        value: "edit_theme",
    }));
    await interaction.reply({ content: "What do you wish to edit?", components: [actionRow] })
        .catch(() => {
        interaction.editReply({ content: "What do you wish to edit?", components: [actionRow] });
    });
};
module.exports = {
    editOptions
};
