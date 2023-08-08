import {SlashCommand} from "../../../../structures/SlashCommand";
import {ActionRowBuilder, ButtonStyle, ButtonBuilder} from "discord.js";
import Models from "../../../../typings/MongoTypes";


const removeWelcomeCommand = new SlashCommand({
    name: 'remove',
    description: 'Remove welcome message for the server',
    userPermissions: ['Administrator'],
    run: async ({interaction}) => {

        // find if there is data, if not say that there is nothing to remove otherwise send a confirmation button yes or no.
        // everything should be a Promise
        new Promise(async (resolve, reject) => {
            let data = await Models.WelcomeModel.findOne({
                serverId: `${interaction.guild.id}`
            });

            if (!data) {
                reject("There is no welcome message to remove.\nPlease configure one first with `/welcome configure`.");
            }
            else {
                resolve("Are you sure you want to remove the welcome message?");
            }
        })
        .then(async (res: string) => {
            // create an actionrowbuilder with a ❌ button and a ✅ button
            const actionRow: ActionRowBuilder<any> = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("welcome_remove_yes")
                        .setLabel("✅")
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId("welcome_remove_no")
                        .setLabel("❌")
                        .setStyle(ButtonStyle.Secondary)
                );

            // send the message
            await interaction.reply({
                content: res,
                components: [actionRow]
            });
        })
        .catch(async (err: string) => {
            await interaction.reply({
                content: err
            });
        });
    }
});

export default removeWelcomeCommand;

