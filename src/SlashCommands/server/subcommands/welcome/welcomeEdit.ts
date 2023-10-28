import { SlashCommand } from '../../../../structures/SlashCommand';
import { ChannelType } from 'discord.js';
import Models from '../../../../typings/MongoTypes';
import { setTimeout as wait } from 'node:timers/promises';
import { editOptions } from './src/selector/selectEdit';

const editWelcomeCommand = new SlashCommand({
    name: 'edit',
    description: 'Edit welcome message for the server',
    userPermissions: ['Administrator'],
    run: async ({ interaction }) => {
        new Promise(async (resolve, reject) => {
            let data = await Models.WelcomeModel.findOne({
                serverId: `${interaction.guild.id}`,
            });

            if (!data) {
                reject(
                    'Welcome message has not been configured. Please configure one first with `/welcome configure`.',
                );
            } else {
                resolve(
                    'Welcome message can be edited now. Proceeding to edit options...',
                );
            }
        })
            .then(async (res: string) => {
                await interaction.reply({
                    content: res,
                });
                await wait(3000);
                await editOptions(interaction);
            })
            .catch(async (err: string) => {
                await interaction
                    .reply({
                        content: err,
                    })
                    .catch(async () => {
                        await interaction.editReply({
                            content: 'An error occurred. Please try again.',
                        });
                    });
            });
    },
});

export default editWelcomeCommand;
