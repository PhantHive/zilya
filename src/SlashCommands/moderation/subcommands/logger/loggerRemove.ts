import { SlashCommand, SubCommand } from '../../../../structures/SlashCommand';
import Models from '../../../../typings/MongoTypes';

export const removeLoggerCommand = new SubCommand({
    name: 'remove',
    description: 'Remove logger for the server',
    run: async ({ interaction }) => {
        // remove logger
        // find logger in database
        let data = await Models.LoggerModel.findOne({
            serverId: interaction.guild.id,
        });
        new Promise(async (resolve) => {
            if (!data) {
                await interaction.reply({
                    content: 'Logger is not configured for this server.',
                    ephemeral: true,
                });
            } else {
                new Promise(async (resolve) => {
                    await Models.LoggerModel.findOneAndDelete({
                        serverId: interaction.guild.id,
                    });

                    await interaction.reply({
                        content: 'Logger has been removed.',
                        ephemeral: true,
                    });
                }).catch((err: Error) => {
                    console.log(err);
                    interaction.reply({
                        content: 'An error occurred.',
                        ephemeral: true,
                    });
                });
            }
        }).catch((err: Error) => {
            console.log(err);
            interaction.reply({
                content: 'An error occurred.',
                ephemeral: true,
            });
        });
    },
});

exports.default = removeLoggerCommand;
