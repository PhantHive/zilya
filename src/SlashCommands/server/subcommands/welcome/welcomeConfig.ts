import {SlashCommand} from "../../../../structures/SlashCommand";
import {EmbedBuilder, ChannelType} from "discord.js";
const WDB = require("../../../../assets/utils/models/welcome.js");
import colors from "../../../../assets/data/colors.json";
const { customThemeWelcome, customColorWelcome, selectChannelId} = require("./src/setter/setCustom");
const Client = require("../../../../structures/Client");

exports.default = new SlashCommand({
    name: 'configure',
    description: 'Configure welcome message for the server',
    userPermissions: ['Administrator'],
    run: async ({interaction}) => {

        let data = WDB.findOne({
            server_id: `${interaction.guild.id}`
        });

        if (data) {

            new Promise(async (resolve) => {
                let channels = interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildText).map(c => {
                    return {
                        label: `${c.name}`,
                        value: `${c.id}`
                    }
                });

                if (channels.length >= 25) {
                    channels.splice(24, channels.length - 23)
                }
                await selectChannelId(Client, interaction, channels)
                resolve(true);
            })




        }


    }
});