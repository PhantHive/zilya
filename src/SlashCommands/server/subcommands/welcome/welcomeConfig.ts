import { SubCommand } from '../../../../structures/SlashCommand';
import Models from '../../../../typings/MongoTypes';
import { nextStep } from './src/setter/setCustom';
import { ExtendedSelectMenuInteraction } from '../../../../typings/SlashCommand';

export const configureWelcomeCommand = new SubCommand({
    name: 'configure',
    description: 'Configure welcome message for the server',
    run: async ({ interaction }) => {
        let data = await Models.WelcomeModel.findOne({
            serverId: `${interaction.guild.id}`,
        });

        if (!data) {
            await new Models.WelcomeModel({
                serverId: `${interaction.guild.id}`,
                channelId: '0',
                theme: -1,
                color: '#000000',
            }).save();

            data = await Models.WelcomeModel.findOne({
                serverId: `${interaction.guild.id}`,
            });

            await nextStep(data, interaction as ExtendedSelectMenuInteraction);
        } else {
            await nextStep(data, interaction as ExtendedSelectMenuInteraction);
        }
    },
});

