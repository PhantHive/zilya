import { SubCommand } from '../../../../structures/SlashCommand';
import Models from '../../../../typings/MongoTypes';
import { setTimeout as wait } from 'node:timers/promises';
import { editOptions } from './src/selector/selectEdit';

export const editWelcomeCommand = new SubCommand({
    name: 'edit',
    description: 'Edit welcome message for the server',
    run: async ({ interaction }) => {
        let data = await Models.WelcomeModel.findOne({
            serverId: `${interaction.guild.id}`,
        });

        if (!data) {
            await interaction.editReply({ content: 'Welcome message has not been configured. Please configure one first with `/welcome configure`.' })
        } else {
            await interaction.editReply({
                content: 'Welcome message can be edited now. Proceeding to edit options...'
            });
            await wait(3000);
            await editOptions(interaction);
        }
    },
});
