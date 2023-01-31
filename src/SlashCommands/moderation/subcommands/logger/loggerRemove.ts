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
        LG.findOne({
            serverId: interaction.guild.id
        },
        (err, data) => {
            if (err) console.error(err);
            if (!data) {
                interaction.reply({
                    content: 'Logger is not configured for this server.',
                    ephemeral: true
                });
            } else {
                LG.findOneAndDelete({
                    serverId: interaction.guild.id
                }, (err, data) => {
                    if (err) console.error(err);
                    interaction.reply({
                        content: 'Logger has been removed.',
                        ephemeral: true
                    });
                });
            }
        });
    }

});
