import {SlashCommand} from "../../../../structures/SlashCommand";
import {RunOptions} from "../../../../typings/SlashCommand";
import {ExtendedInteraction} from "../../../../typings/SlashCommand";
import {client} from "../../../../index";
const LG = require("../../../../assets/models/logger.js");


exports.default = new SlashCommand({
    name: 'remove',
    description: 'Remove logger for the server',
    userPermissions: ['Administrator'],
    run: async ({interaction}) => {

        // remove logger
        // find logger in database
        let data = await LG.findOne({
            serverId: interaction.guild.id
            });
        new Promise(async (resolve) => {
            if (!data) {
                await interaction.reply({
                    content: 'Logger is not configured for this server.',
                    ephemeral: true
                });
            } else {
                
                new Promise(async (resolve) => {

                    await LG.findOneAndDelete({
                        serverId: interaction.guild.id
                    });

                    await interaction.reply({
                        content: 'Logger has been removed.',
                        ephemeral: true
                    });
                })
                    .catch((err: Error) => {
                        console.log(err);
                        interaction.reply({ content: 'An error occurred.', ephemeral: true });
                    })
            }
        })
            .catch((err: Error) => {
                console.log(err);
                interaction.reply({ content: 'An error occurred.', ephemeral: true });
            });
    }

});
