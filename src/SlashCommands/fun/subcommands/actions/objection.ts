import {SlashCommand} from "../../../../structures/SlashCommand";
import {EmbedBuilder} from "discord.js";
import {tenorApiSearcher} from "./searcher";

exports.default = new SlashCommand({
    name: 'hug',
    description: 'Hug someone',
    run: async ({interaction}) => {

        // use tenor api to get a random gif of anime hug
        let search_term = "objection";
        await tenorApiSearcher(search_term)
            .then((objection: string) => {
                // send the embed
                const embed = new EmbedBuilder()
                    .setColor('#00ff9d')
                    .setTitle(`${interaction.user.username} Objected!`)
                    .setImage(objection)
                    .setTimestamp()

                interaction.reply({embeds: [embed]});
            })
            .catch((err: string) => {
                console.log(err);
            });

    }
});
