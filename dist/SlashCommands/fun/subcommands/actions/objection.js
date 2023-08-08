"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlashCommand_1 = require("../../../../structures/SlashCommand");
const discord_js_1 = require("discord.js");
const searcher_1 = require("./searcher");
exports.default = new SlashCommand_1.SlashCommand({
    name: 'hug',
    description: 'Hug someone',
    run: async ({ interaction }) => {
        // use tenor api to get a random gif of anime hug
        let search_term = "objection";
        await (0, searcher_1.tenorApiSearcher)(search_term)
            .then((objection) => {
            // send the embed
            const embed = new discord_js_1.EmbedBuilder()
                .setColor('#00ff9d')
                .setTitle(`${interaction.user.username} Objected!`)
                .setImage(objection)
                .setTimestamp();
            interaction.reply({ embeds: [embed] });
        })
            .catch((err) => {
            console.log(err);
        });
    }
});
