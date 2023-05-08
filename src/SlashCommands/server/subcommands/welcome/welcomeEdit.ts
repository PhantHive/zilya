import {SlashCommand} from "../../../../structures/SlashCommand";
import {EmbedBuilder, ChannelType} from "discord.js";
const WDB = require("../../../../assets/utils/models/welcome.js");
import {setTimeout as wait} from "node:timers/promises";
const { editOptions } = require("./src/selector/selectEdit");


exports.default = new SlashCommand({
    name: 'edit',
    description: 'Edit welcome message for the server',
    userPermissions: ['Administrator'],
    run: async ({interaction}) => {

        new Promise( async (resolve, reject) => {

            let data = await WDB.findOne({
                server_id: `${interaction.guild.id}`
            });

            if (!data) {

                reject("Welcome message has not been configured. Please configure one first with `/welcome configure`.");
            }
            else {
                resolve("Welcome message can be edited now. Proceeding to edit options...");
            }
        })
        .then(async (res: string) => {
            await interaction.reply({
                content: res
            });
            await wait(3000);
            await editOptions(interaction);
        })
        .catch(async (err: string) => {
            await interaction.reply({
                content: err
            })
                .catch(async () => {
                    await interaction.editReply({
                        content: "An error occurred. Please try again."
                    });
                })
        });
    }
});