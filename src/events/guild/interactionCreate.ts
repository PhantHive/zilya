import { client } from '../../index';
import { Event } from '../../structures/Event';
import { ExtendedInteraction, ExtendedSelectMenuInteraction } from '../../typings/SlashCommand';
import {ButtonStyle, ChannelType, CommandInteractionOptionResolver} from "discord.js";
import {setTimeout as wait} from "node:timers/promises";
const { customThemeWelcome, customColorWelcome, selectChannelId} = require("../../SlashCommands/server/subcommands/welcome/src/setter/setCustom");
const WDB = require("../../assets/utils/models/welcome.js");
const themes = require("../../assets/data/theme.json");
const { setChannelId, setTheme, setColor } = require("../../SlashCommands/server/subcommands/welcome/src/setter/setCustom");


export default new Event('interactionCreate', async (interaction) => {


    if (interaction.isStringSelectMenu()) {

        console.log("string select menu");

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

        if ((interaction as ExtendedSelectMenuInteraction).customId === "channel_id") {
            await setChannelId(data, interaction);
        }

        else if ((interaction as ExtendedSelectMenuInteraction).customId === "theme") {
            await setTheme(data, interaction);
        }

        else if ((interaction as ExtendedSelectMenuInteraction).customId === "color") {
            await setColor(data, interaction);
        }

    }

    if (!interaction.isCommand()) return;


    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    await command.run({
        args: (interaction as ExtendedInteraction).options as CommandInteractionOptionResolver,
        client,
        interaction: interaction as (ExtendedInteraction | ExtendedSelectMenuInteraction)
    });


});
