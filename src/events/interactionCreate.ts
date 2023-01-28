import { client } from '..';
import { Event } from '../structures/Event';
import { ExtendedInteraction } from "../typings/SlashCommand";
import {ButtonStyle, CommandInteractionOptionResolver} from "discord.js";

export default new Event('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    await command.run({
        args: interaction.options as CommandInteractionOptionResolver,
        client,
        interaction: interaction as ExtendedInteraction
    });
});
