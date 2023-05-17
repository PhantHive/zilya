import {SlashCommand} from "../../structures/SlashCommand";
import {AttachmentBuilder, BaseImageURLOptions} from "discord.js";
import {createCanvas, Image, loadImage, CanvasRenderingContext2D} from "canvas";
import * as fs from "fs";
const GifEncoder = require('gif-encoder-2');
const { GifReader } = require('omggif');
const fetch = require('node-fetch');
const RDB = require("../../assets/utils/models/rank.js");

const getFontSize = (ctx: CanvasRenderingContext2D, maxwidth: number, text: string, initialFontSize: number): [string, number] => {
    let font = initialFontSize;

    do {
        font -= 5;
        ctx.font = `${font}px "Apocs" "Arial" normal`;
    } while (ctx.measureText(text).width > maxwidth);

    return [ctx.font, ctx.measureText(text).width];
};

const drawShape = async (ctx: CanvasRenderingContext2D, canvas): Promise<void> => {

    ctx.strokeStyle = "#b7a4a4";
    ctx.lineWidth = 1.2;

    // left side
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, canvas.height);
    ctx.lineTo(365, canvas.height);
    // left curve of the profile pic. (left part of the card)
    // --------------------
    ctx.quadraticCurveTo(365*0.75, ((canvas.height * 0.6) / 2) + canvas.height * 0.4, 365, canvas.height * 0.4);
    ctx.quadraticCurveTo(365*0.84, canvas.height * 0.30, 365*0.70, canvas.height * 0.37) // arrival 361*0.70, canvas.height * 0.35
    ctx.quadraticCurveTo(365*0.47, canvas.height * 0.45, 365 * 0.35, canvas.height * 0.20);
    // --------------------
    ctx.lineTo(365 * 0.28, canvas.height * 0.07);
    // --------------------
    ctx.quadraticCurveTo(365 * 0.24, canvas.height * 0.01, 365*0.10, 0);
    // --------------------
    ctx.lineTo(0, 0);


    // --------------------
    // PROFILE PIC
    ctx.moveTo(canvas.width * 0.62, ((canvas.height * 0.6) / 2) + canvas.height * 0.4) // go to the middle of the profile pic
    ctx.arc(canvas.width * 0.62, ((canvas.height * 0.6) / 2) + canvas.height * 0.4, canvas.height * 0.3, 0, Math.PI * 2, false);

    // --------------------

    // right side bottom leaf
    ctx.moveTo(canvas.width * 0.715, canvas.height * 0.45);
    // make the quadratic in the opposite way
    ctx.quadraticCurveTo(canvas.width * 0.81, ((canvas.height * 0.6) / 2) + canvas.height * 0.45, canvas.width * 0.70, canvas.height);
    ctx.lineTo(canvas.width * 0.77, canvas.height);
    ctx.quadraticCurveTo(canvas.width*0.81, canvas.height, canvas.width*0.85, canvas.height*0.92)
    ctx.quadraticCurveTo(canvas.width*0.91, canvas.height*0.82, canvas.width*0.96, canvas.height*0.92)
    ctx.lineTo(canvas.width, canvas.height)
    ctx.quadraticCurveTo(canvas.width*0.91, canvas.height*0.5, canvas.width * 0.715, canvas.height * 0.45)


    // top leaf
    ctx.moveTo(canvas.width * 0.75, canvas.height * 0.46);
    ctx.lineTo(canvas.width * 0.77, canvas.height * 0.35)
    ctx.quadraticCurveTo(canvas.width*0.8, canvas.height*0.2, canvas.width*0.9, canvas.height*0.15);
    // // opposite angle of the above leaf
    ctx.quadraticCurveTo(canvas.width*0.95, canvas.height*0.4, canvas.width*0.93, canvas.height*0.5);
    ctx.lineTo(canvas.width*0.90, canvas.height*0.65);
    ctx.quadraticCurveTo(canvas.width*0.85, canvas.height*0.52, canvas.width*0.75, canvas.height*0.46);
    ctx.closePath();


    ctx.clip();
    ctx.stroke();

    ctx.save();


    // draw the background
    ctx.globalAlpha = 0.45;
    const background = await loadImage(`${process.cwd()}/src/assets/img/welcome/landscapes/landscape-2.jpg`);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);


}

const drawBar = (ctx, x, y, width, height, fillColor) => {
    // Draw bar
    // if width is less than 0.002% of the canvas width, don't draw it
    if (width < 0.002 * ctx.canvas.width) return;

    // adjust corenerRadius if the width is too small
    const cornerRadius = width < height ? width / 2 : height / 2;

    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.moveTo(x, y + cornerRadius);
    ctx.quadraticCurveTo(x, y, x + cornerRadius, y);
    ctx.lineTo(x + width - cornerRadius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + cornerRadius);
    ctx.lineTo(x + width, y + height - cornerRadius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - cornerRadius, y + height);
    ctx.lineTo(x + cornerRadius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - cornerRadius);
    ctx.closePath();
    ctx.fill();
};


const drawXpBar = async (ctx, canvas, data: any): Promise<void> => {
    let font;
    const nextLvlXpMsg = 25 * (data.level_msg ** 2) + 15 * data.level_msg + 25;
    const currentXpMsg = data.xp_msg;
    const percentageMsg = currentXpMsg / nextLvlXpMsg;

    const nextLvlXpVocal = 25 * (data.level_vocal ** 2) + 15 * data.level_vocal + 25;
    const currentXpVocal = data.xp_vocal;
    const percentageVocal = currentXpVocal / nextLvlXpVocal;

    const msgXpEmoji: Image = await loadImage(`${process.cwd()}/src/assets/img/rank-card/msg-xp.png`);
    const vocalXpEmoji: Image = await loadImage(`${process.cwd()}/src/assets/img/rank-card/mic-xp.png`);

    // MSG XP BAR
    ctx.globalAlpha = 1;
    await drawBar(ctx, canvas.width * 0.04, canvas.height * 0.65, canvas.width * 0.33, 17, "rgba(0,0,0,0.5)")
    // draw the xp bar
    await drawBar(ctx, canvas.width * 0.04, canvas.height * 0.65, canvas.width * 0.33 * percentageMsg, 17, "rgba(145,127,127,0.9)")


    // VOCAL XP BAR
    await drawBar(ctx, canvas.width * 0.04, canvas.height * 0.85, canvas.width * 0.33, 17, "rgba(0,0,0,0.5)")
    // draw the xp bar
    await drawBar(ctx, canvas.width * 0.04, canvas.height * 0.85, canvas.width * 0.33 * percentageVocal, 17, "rgba(145,127,127,0.9)")


    // draw the xp emoji on the left side
    ctx.drawImage(msgXpEmoji, canvas.width * 0.005, canvas.height * 0.64, 20, 20);
    ctx.drawImage(vocalXpEmoji, canvas.width * 0.0002, canvas.height * 0.82, 35, 30);


    // draw the xp text on the center of each bar "currentXpMsg + "/" + nextLvlXpMsg"
    // max width of the text need to be 0.4 of the bar width
    let xpMsgTxt: string = `${currentXpMsg}/${nextLvlXpMsg}`;
    font = getFontSize(ctx, (canvas.width * 0.35) * 0.37, xpMsgTxt as string, 24);
    font[0] = font[0].replace("normal", "bold");
    ctx.font = font[0];
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(xpMsgTxt, canvas.width * 0.2, canvas.height * 0.705);

    let xpVocalTxt: string = `${currentXpVocal}/${nextLvlXpVocal}`;
    font = getFontSize(ctx, (canvas.width * 0.35) * 0.37, xpVocalTxt, 24);
    font[0] = font[0].replace("normal", "bold");
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(xpVocalTxt, canvas.width * 0.2, canvas.height * 0.905);

    ctx.restore();

    // add the level text on top left of each bar
    let levelMsgTxt: string = `Lvl: ${data.level_msg}`;
    font = getFontSize(ctx, canvas.width * 0.15, levelMsgTxt, 27);
    ctx.font = font[0];
    ctx.fillStyle = "#ffffff";
    // top right of the bar
    ctx.textAlign = "right";
    ctx.fillText(levelMsgTxt, canvas.width * 0.36, canvas.height * 0.63);

    let levelVocalTxt: string = `Lvl: ${data.level_vocal}`;
    font = getFontSize(ctx, canvas.width * 0.15, levelVocalTxt, 27);
    ctx.font = font[0];
    ctx.fillStyle = "#ffffff";
    // top right
    ctx.textAlign = "right";
    ctx.fillText(levelVocalTxt, canvas.width * 0.36, canvas.height * 0.83);


    // ----------------- RANK -----------------
    let rankMsgTxt: string = `#${data.rank_msg}`;
    font = getFontSize(ctx, canvas.width * 0.11, rankMsgTxt, 27);
    ctx.font = font[0];
    ctx.fillStyle = "#ffffff";
    // right of the msg bar
    ctx.textAlign = "left";
    ctx.fillText(rankMsgTxt, canvas.width * 0.38, canvas.height * 0.7);

    let rankVocalTxt: string = `#${data.rank_vocal}`;
    font = getFontSize(ctx, canvas.width * 0.11, rankVocalTxt, 27);
    ctx.font = font[0];
    ctx.fillStyle = "#ffffff";
    // right of the vocal bar
    ctx.textAlign = "left";
    ctx.fillText(rankVocalTxt, canvas.width * 0.38, canvas.height * 0.9);
    // -----------------------------------------


}

async function drawGlobalRank(ctx, canvas, data: any, interaction): Promise<void> {

    const globalRank = (data.rank_msg + data.rank_vocal) / 2;

    // draw the global rank
    let globalRankTxt: string = `#${globalRank}`;
    let font = getFontSize(ctx, canvas.width * 0.15, globalRankTxt, 50);
    ctx.font = font[0];
    ctx.fillStyle = "#ffffff";
    // top right
    ctx.textAlign = "left";
    let textWidth: number = canvas.width * 0.85 - font[1] / 2;
    ctx.fillText(globalRankTxt, textWidth, canvas.height * 0.42);


}

const drawCard = async (ctx, canvas, data: any, interaction): Promise<AttachmentBuilder> => {

    // draw global shape
    await drawShape(ctx, canvas);
    ctx.globalAlpha = 1;
    ctx.save();
    // draw the avatar

    let avatarCanvas = createCanvas(canvas.width, canvas.height);
    let avatarCtx = avatarCanvas.getContext("2d");

    const avatarUrl = interaction.member.displayAvatarURL({ extension: 'png', forceStatic: false, size: 2048 } as BaseImageURLOptions);
    let avatar;
    async function loadAvatar(): Promise<void> {
        avatar = await loadImage(avatarUrl);
    }
    await loadAvatar();
    const imageWidth = canvas.height * 0.6;
    const imageHeight = canvas.height * 0.6;
    const offsetX = canvas.width * 0.62 - imageWidth / 2;
    const offsetY = ((canvas.height * 0.6) / 2) + canvas.height * 0.4 - imageHeight / 2;

    // create canvas for the avatar

    avatarCtx.beginPath();
    avatarCtx.lineWidth = 2;
    avatarCtx.strokeStyle = "#b7a4a4";
    avatarCtx.arc(canvas.width * 0.62, (canvas.height * 0.6) / 2 + canvas.height * 0.4, imageWidth / 2, 0, Math.PI * 2, false);
    avatarCtx.closePath();
    avatarCtx.stroke();
    avatarCtx.clip();

    avatarCtx.drawImage(avatar, offsetX, offsetY, imageWidth, imageHeight);

    ctx.drawImage(avatarCanvas, 0, 0, canvas.width, canvas.height);


    const serverIconUrl = interaction.guild.iconURL({ extension: 'png', forceStatic: false } as BaseImageURLOptions);
    let serverIcon;
    async function loadServerIcon(): Promise<void> {
        serverIcon = await loadImage(serverIconUrl);
    }
    await loadServerIcon();


    // draw server icon inside the circle
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#b7a4a4";
    ctx.drawImage(serverIcon, canvas.width * 0.8, canvas.height * 0.7, 40, 40);
    ctx.arc(canvas.width * 0.8 + 20, canvas.height * 0.7 + 20, 20, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.stroke();


    // draw the text inside the card
    ctx.fillStyle = "#ffffff";
    let font: [string, number] = getFontSize(ctx, canvas.width * 0.2, `${interaction.user.username}`, 75);
    ctx.font = font[0];
    ctx.fillText(`${interaction.user.username}`, canvas.width * 0.025, canvas.height * 0.45);


    // draw xp bar
    await drawXpBar(ctx, canvas, data);

    // draw global rank of serv, msg and vocal / 2
    await drawGlobalRank(ctx, canvas, data, interaction);


    return new AttachmentBuilder(canvas.toBuffer(), {name: 'rank_card.png'});


}



exports.default = new SlashCommand({
    name: 'rank',
    description: 'Display the rank card',
    run: async ({interaction}) => {

        await interaction.deferReply();

        // creating context
        const canvas = createCanvas(670, 270)
        // make canvas transparent
        const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

        new Promise(async (resolve, reject) => {
            let data = await RDB.findOne({
                server_id: `${interaction.guild.id}`,
                user_id: `${interaction.user.id}`
            })
                .catch(err => {
                    reject(err);
                });

            if (!data) {

                // check number of doc in db to set rank
                const nbMembers: number = await RDB.countDocuments({
                    server_id: `${interaction.guild.id}`
                });

                data = await RDB.create({
                    server_id: `${interaction.guild.id}`,
                    user_id: `${interaction.user.id}`,
                    xp_msg: 0,
                    level_msg: 1,
                    rank_msg: nbMembers + 1,
                    xp_vocal: 0,
                    level_vocal: 1,
                    rank_vocal: nbMembers + 1
                });

                resolve(data);
            }
            else {
                resolve(data)
            }
        })
            .then(async (data: any) => {
                // drawing card
                let card = await drawCard(ctx, canvas, data, interaction);
                console.log(card)
                await interaction.editReply({files: [card]});
            })
            .catch(async (err) => {
                await interaction.editReply({content: `An error occurred: ${err}`});
            });

    }
});