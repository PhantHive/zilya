import { client } from '../../index';
import { Event } from '../../structures/Event';
import { ExtendedInteraction, ExtendedSelectMenuInteraction } from '../../typings/SlashCommand';
import {ButtonStyle, ChannelType, CommandInteractionOptionResolver} from "discord.js";
import {setTimeout as wait} from "node:timers/promises";
const { customThemeWelcome, customColorWelcome, selectChannelId} = require("../../SlashCommands/server/subcommands/welcome/src/setter/setCustom");
const WDB = require("../../assets/utils/models/welcome.js");
const themes = require("../../assets/data/theme.json");

const isChannelValid = async (channel, configName) => new Promise((resolve, reject) => {

    const id = Number(channel);
    if (Number.isInteger(id) && id !== 0 ) {
        resolve(`Thank you! I will setup ${configName} message in this channel.`);
    }
    else {
        reject(`Sorry, I can't setup the ${configName} message in this channel. It is probably not a valid channel.`);
    }

})



export default new Event('interactionCreate', async (interaction) => {


    if (interaction.isStringSelectMenu()) {

        console.log("string select menu");

        // ================
        // WELCOME SYSTEM
        // ================

        // welcome message edit
        // if ((interaction as ExtendedSelectMenuInteraction).customId === "edit_welcome") {
        //     if ((interaction as ExtendedSelectMenuInteraction).values[0] === "edit_channel_id") {
        //         await chooseConfigWelcome(client, interaction, 1, true);
        //     }
        //     else if ((interaction as ExtendedSelectMenuInteraction).values[0] === "edit_theme") {
        //         await chooseConfigWelcome(client, interaction, 2, true);
        //     }
        //     else if ((interaction as ExtendedSelectMenuInteraction).values[0] === "edit_color") {
        //         await chooseConfigWelcome(client, interaction, 3, true);
        //     }
        // }

        // welcome message


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
