import {SlashCommand} from "../../../../structures/SlashCommand";
import {EmbedBuilder, ChannelType} from "discord.js";
const WDB = require("../../../../assets/utils/models/welcome.js");
import colors from "../../../../assets/data/colors.json";
const { nextStep } = require("./src/setter/setCustom");


exports.default = new SlashCommand({
    name: 'configure',
    description: 'Configure welcome message for the server',
    userPermissions: ['Administrator'],
    run: async ({interaction}) => {

        let data = await WDB.findOne({
            server_id: `${interaction.guild.id}`
        });

        if (!data) {
            await new WDB({
                server_id: `${interaction.guild.id}`,
                channel_id: "0",
                theme: -1,
                color: "#000000"
            }).save();

            data = await WDB.findOne({
                server_id: `${interaction.guild.id}`
            });

            await nextStep(data, interaction);
        }
        else {
            await nextStep(data, interaction);
        }

    }
});