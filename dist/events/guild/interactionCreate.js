"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
const Event_1 = require("../../structures/Event");
exports.default = new Event_1.Event('interactionCreate', async (interaction) => {
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
