import { SlashCommand } from '../../structures/SlashCommand';
import {DrawRankCard} from "./rank/drawer/drawCard";
import {
    createCanvas,
    Image,
    loadImage,
    CanvasRenderingContext2D, registerFont,
} from 'canvas';
import Models from '../../typings/MongoTypes';
import path from 'path';
import {ExtendedInteraction} from "../../typings/SlashCommand";


exports.default = new SlashCommand({
    name: 'rank',
    description: 'Display the rank card',
    run: async ({ interaction }) => {
        await interaction.deferReply();

        // creating context
        const canvas = createCanvas(670, 270);
        // make canvas transparent
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

        new Promise(async (resolve, reject) => {
            let data = await Models.RankModel.findOne({
                serverId: `${interaction.guild.id}`,
                userId: `${interaction.user.id}`,
            }).catch((err) => {
                reject(err);
            });

            if (!data) {
                // check number of doc in db to set rank
                const nbMembers: number = await Models.RankModel.countDocuments(
                    {
                        serverId: `${interaction.guild.id}`,
                    }
                );

                data = await Models.RankModel.create({
                    serverId: `${interaction.guild.id}`,
                    userId: `${interaction.user.id}`,
                    xpMsg: 0,
                    levelMsg: 1,
                    rankMsg: nbMembers + 1,
                    xpVocal: 0,
                    levelVocal: 1,
                    rankVocal: nbMembers + 1,
                });

                resolve(data);
            } else {
                resolve(data);
            }
        })
            .then(async (data: any) => {
                // drawing card
                let card = new DrawRankCard(ctx, canvas, data, interaction as ExtendedInteraction);
                let cardBuffer = await card.drawCard();

                console.log(cardBuffer);
                await interaction.editReply({ files: [cardBuffer] });
            })
            .catch(async (err) => {
                await interaction.editReply({
                    content: `An error occurred: ${err}`,
                });
            });
    },
});
