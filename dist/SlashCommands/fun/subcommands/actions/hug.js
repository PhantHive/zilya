"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlashCommand_1 = require("../../../../structures/SlashCommand");
const discord_js_1 = require("discord.js");
const searcher_1 = require("./searcher");
exports.default = new SlashCommand_1.SlashCommand({
    name: 'hug',
    description: 'Hug someone',
    options: [
        {
            "name": "user",
            "description": "User to hug",
            "type": 6,
            "required": true
        }
    ],
    run: async ({ interaction }) => {
        const user = interaction.options.getUser('user');
        let huggedOne;
        if (user.id === interaction.user.id) {
            huggedOne = "him/herself";
        }
        else if (user.bot) {
            huggedOne = "a beautiful BOT";
        }
        else {
            huggedOne = user;
        }
        // use tenor api to get a random gif of anime hug
        let search_term = "anime hug";
        await (0, searcher_1.tenorApiSearcher)(search_term)
            .then((hug) => {
            // send the embed
            const embed = new discord_js_1.EmbedBuilder()
                .setColor('#00ff9d')
                .setTitle(`♥ ${interaction.user.username} hugged ${huggedOne} ♥`)
                .setImage(hug)
                .setTimestamp();
            interaction.reply({ embeds: [embed] });
        })
            .catch((err) => {
            console.log(err);
        });
    }
});
