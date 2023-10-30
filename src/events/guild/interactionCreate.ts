import type { CommandInteractionOptionResolver } from 'discord.js';
import { setChannelId, setTheme, setColor } from '../../SlashCommands/server/subcommands/welcome/src/setter/setCustom';
import { setEdit } from '../../SlashCommands/server/subcommands/welcome/src/setter/setEdit';
import WelcomeModel from '../../assets/utils/models/Welcome';
import { Event } from '../../structures/Event';
import type { IWelcomeDocument } from '../../typings/MongoTypes';
import type {
    ExtendedInteraction,
    ExtendedSelectMenuInteraction,
} from '../../typings/SlashCommand';

export default new Event('interactionCreate', async (client, interaction) => {
    if (interaction.isStringSelectMenu()) {

        if (!interaction.guild) return;
        // ================
        // WELCOME SYSTEM
        // ================
        let data = await WelcomeModel.findOne<IWelcomeDocument>({
            serverId: `${interaction.guild.id}`,
        }) as IWelcomeDocument;

        if (!data) {
            await new WelcomeModel({
                serverId: `${interaction.guild.id}`,
                channelId: '0',
                theme: -1,
                color: '#000000',
            }).save();

            data = await WelcomeModel.findOne<IWelcomeDocument>({
                serverId: `${interaction.guild.id}`,
            }) as IWelcomeDocument;
        }

        // setter
        if (
            (interaction as ExtendedSelectMenuInteraction).customId ===
            'channel_id'
        ) {
            await setChannelId(data, interaction);
        } else if (
            (interaction as ExtendedSelectMenuInteraction).customId === 'theme'
        ) {
            await setTheme(data, interaction);
        } else if (
            (interaction as ExtendedSelectMenuInteraction).customId === 'color'
        ) {
            await setColor(data, interaction);
        }

        // selector
        else if (
            (interaction as ExtendedSelectMenuInteraction).customId ===
            'edit_welcome'
        ) {
            // get value that need to be edited
            const value = (interaction as ExtendedSelectMenuInteraction)
                .values[0];
            if (!value) return;
            await setEdit(data, interaction, value);
        }
    } else if (interaction.isButton()) {
        if (!interaction.guild) return;
        // ================
        // WELCOME SYSTEM
        // ================
        // check if customId is welcome_remove_yes
        if (interaction.customId === 'welcome_remove_yes') {
            // remove the welcome message
            await WelcomeModel.findOneAndDelete<IWelcomeDocument>({
                serverId: `${interaction.guild.id}`,
            });

            // send a confirmation message
            await interaction.update({
                content: 'Welcome message has been removed.',
                components: [],
            });
        } else if (interaction.customId === 'welcome_remove_no') {
            // send a confirmation message
            await interaction.update({
                content: 'Welcome message removal has been cancelled.',
                components: [],
            });
        }
    }

    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    console.log('Exec command', command);
    await command.run({
        interaction: interaction as
            | ExtendedInteraction
            | ExtendedSelectMenuInteraction,
        _args: (interaction as ExtendedInteraction)
            .options as CommandInteractionOptionResolver,
        _client: client,
    });
});
