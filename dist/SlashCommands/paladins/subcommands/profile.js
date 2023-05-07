"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlashCommand_1 = require("../../../structures/SlashCommand");
const paladinsJS = require('paladins.js');
const { createCanvas } = require("canvas");
const { drawCard, drawStats } = require("./src/drawProfile");
const { AttachmentBuilder } = require("discord.js");
let pal = new paladinsJS.API({
    devId: process.env.DEV_ID,
    authKey: process.env.PALADINS
}); // API loaded and ready to go.
const userCard = async (paladinsProfile) => {
    // creating context
    const canvas = createCanvas(1250, 1500);
    const ctx = canvas.getContext("2d");
    // drawing card
    await drawCard(ctx, canvas, paladinsProfile);
    // drawing stats
    await drawStats(ctx, canvas, paladinsProfile);
    return new AttachmentBuilder(canvas.toBuffer(), { name: 'paladins_profile.png' });
};
exports.default = new SlashCommand_1.SlashCommand({
    name: 'profile',
    description: 'Get user profile',
    options: [
        {
            "name": "nickname",
            "description": "Nickname of the player",
            "type": 3,
            "required": true
        }
    ],
    run: async ({ interaction }) => {
        const pseudo = (interaction as ExtendedInteraction).options.get('nickname').value;
        await interaction.deferReply();
        let paladinsProfile = {
            userAvatar: "",
            hoursPlayed: "",
            level: "",
            platform: "",
            name: "",
            wins: "",
            losses: "",
            title: "",
            region: "",
            playerId: "",
            mostPlayedChamp: "",
            champAvatar: ""
        };
        await pal.getPlayer(pseudo).then(async (res, err) => {
            if (err) {
                console.log("err", err);
            }
            if (res === undefined) {
                return interaction.editReply("Impossible to get datas at the moment.");
            }
            else {
                paladinsProfile.userAvatar = res["AvatarURL"];
                paladinsProfile.hoursPlayed = res["HoursPlayed"];
                paladinsProfile.level = res["Level"];
                paladinsProfile.platform = res["Platform"];
                paladinsProfile.name = res["Name"];
                paladinsProfile.wins = res["Wins"];
                paladinsProfile.losses = res["Losses"];
                paladinsProfile.title = res["Title"];
                paladinsProfile.region = res["Region"];
                paladinsProfile.playerId = res["ActivePlayerId"];
            }
            await pal.getPlayerChampionRanks(paladinsProfile.playerId)
                .then((res, err) => {
                if (err)
                    return console.log(err);
                paladinsProfile.mostPlayedChamp = res[0]["champion"];
            })
                .then(async () => {
                await pal.getChampions()
                    .then((res, err) => {
                    if (err)
                        return console.log(err);
                    if (res === undefined) {
                        return interaction.editReply({ content: "Impossible to get datas at the moment." });
                    }
                    res.forEach(champ => {
                        if (champ["Name"] === paladinsProfile.mostPlayedChamp) {
                            paladinsProfile.champAvatar = champ["ChampionIcon_URL"];
                        }
                    });
                });
                let attachment = await userCard(paladinsProfile);
                /*
                const palaEmbed = new EmbedBuilder()
                    .setAuthor({
                        name: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL()
                    })
                    .setTitle(paladinsProfile.title)
                    .setImage("attachment://paladins_profile.png");
                 */
                await interaction.editReply({ files: [attachment] });
            })
                .catch();
        }).catch(async (err) => {
            console.log(err);
            await interaction.editReply({
                content: `An error has occurred, please try again later.`
            });
        });
    }
});
