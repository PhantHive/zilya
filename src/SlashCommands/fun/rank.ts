import {SlashCommand} from "../../structures/SlashCommand";
import {AttachmentBuilder, BaseImageURLOptions} from "discord.js";
import {createCanvas, Image, loadImage} from "canvas";
import * as fs from "fs";
const GifEncoder = require('gif-encoder-2');
const { GifReader } = require('omggif');
const jimp = require('jimp');
const fetch = require('node-fetch');

const RDB = require("../../assets/utils/models/rank.js");

const getFontSize = async (ctx, maxwidth, text, initialFontSize) => {

    let font = initialFontSize;

    do {
        font -= 10;
        ctx.font = `${font}px "ApoCs" "Arial"`
    } while (ctx.measureText(text).width > maxwidth)

    return [ctx.font, ctx.measureText(text).width];

}


const drawCard = async (ctx, canvas, data: any, interaction) => {


    ctx.save();
    // left side
    ctx.beginPath();
    ctx.strokeStyle = "#ffffff";
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

    ctx.restore();
    // --------------------
    // PROFILE PIC
    ctx.moveTo(canvas.width * 0.62, ((canvas.height * 0.6) / 2) + canvas.height * 0.4) // go to the middle of the profile pic
    ctx.arc(canvas.width * 0.62, ((canvas.height * 0.6) / 2) + canvas.height * 0.4, canvas.height * 0.27, 0, Math.PI * 2, false);


    ctx.stroke();



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


    // server icon
    ctx.moveTo(canvas.width * 0.85, canvas.height * 0.85)
    ctx.arc(canvas.width * 0.825, canvas.height * 0.75, 15, 0, Math.PI * 2, false);
    ctx.stroke();

    // top leaf
    ctx.moveTo(canvas.width * 0.75, canvas.height * 0.46);
    ctx.lineTo(canvas.width * 0.77, canvas.height * 0.35)
    ctx.quadraticCurveTo(canvas.width*0.8, canvas.height*0.2, canvas.width*0.9, canvas.height*0.15);
    // // opposite angle of the above leaf
    ctx.quadraticCurveTo(canvas.width*0.95, canvas.height*0.4, canvas.width*0.93, canvas.height*0.5);
    ctx.lineTo(canvas.width*0.90, canvas.height*0.65);
    ctx.quadraticCurveTo(canvas.width*0.85, canvas.height*0.52, canvas.width*0.75, canvas.height*0.46);
    ctx.stroke();
    ctx.closePath();

    ctx.clip();





    // global form before clipping on it
    // rectangle
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // clip form on the black rectangle

    // check if user has animated avatar


    const avatarUrl = interaction.user.displayAvatarURL({ forceStatic: false } as BaseImageURLOptions);

    let extension = 'png';
    try {
        // try loading the avatar image with the 'gif' extension
        await loadImage(avatarUrl + '?format=gif');
        extension = 'gif';
    } catch (error) {
        // ignore the error, extension will be 'png' if GIF format is not supported
    }

    // construct the final avatar URL with the correct extension
    const finalAvatarUrl = interaction.user.displayAvatarURL({ extension } as BaseImageURLOptions);

    console.log(finalAvatarUrl);
    let avatar;
    async function loadAvatar(): Promise<void> {
        avatar = await loadImage(finalAvatarUrl);
    }
    await loadAvatar();

    if (extension === 'gif') {
        try {
            const res = await fetch(finalAvatarUrl);
            const buf = await res.buffer();
            const gr = new GifReader(buf);
            const encoder = new GifEncoder(canvas.width, canvas.height);
            encoder.start();
            encoder.setRepeat(0);
            encoder.setDelay(0);
            encoder.setQuality(100);
            encoder.setTransparent(null);

            const numFrames = gr.numFrames();
            console.log(numFrames)
            const delay = gr.frameInfo(0).delay * 10; // frame delay in ms

            const frames = [];

            for (let i = 0; i < numFrames; i++) {
                const frameData = gr.frameInfo(i);
                const pixels = new Uint8Array(gr.width * gr.height * 4);
                gr.decodeAndBlitFrameRGBA(i, pixels);
                const canvas = createCanvas(gr.width, gr.height);
                const ctx = canvas.getContext('2d');
                const imageData = ctx.createImageData(gr.width, gr.height);
                imageData.data.set(pixels);
                ctx.putImageData(imageData, 0, 0);
                frames.push({
                    canvas,
                    delay,
                });
            }

            for (const frame of frames) {
                ctx.drawImage(frame.canvas, canvas.width * 0.62 - canvas.height * 0.27, ((canvas.height * 0.6) / 2) + canvas.height * 0.4 - canvas.height * 0.27, canvas.height * 0.54, canvas.height * 0.54);
                encoder.addFrame(ctx);
            }

            encoder.finish();
            const buffer = encoder.out.getData();
            return new AttachmentBuilder(buffer, {name: 'rank_card.gif'});
        } catch (err) {
            console.error(err);
        }

    } else {
        ctx.drawImage(avatar, canvas.width * 0.62 - canvas.height * 0.27, ((canvas.height * 0.6) / 2) + canvas.height * 0.4 - canvas.height * 0.27, canvas.height * 0.54, canvas.height * 0.54);
        return new AttachmentBuilder(canvas.toBuffer(), {name: 'rank_card.png'});
    }

}



exports.default = new SlashCommand({
    name: 'rank',
    description: 'Display the rank card',
    run: async ({interaction}) => {

        // creating context
        const canvas = createCanvas(670, 270)
        const ctx = canvas.getContext("2d");



        new Promise(async (resolve, reject) => {
            let data = await RDB.findOne({
                server_id: `${interaction.guild.id}`,
                user_id: `${interaction.user.id}`
            })
                .catch(err => {
                    reject(err);
                });

            if (!data) {
                data = await RDB.create({
                    server_id: `${interaction.guild.id}`,
                    user_id: `${interaction.user.id}`,
                    xp_msg: 0,
                    level_msg: 1,
                    xp_vocal: 0,
                    level_vocal: 1
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
                await interaction.reply({files: [card]});
            })
            .catch(async (err) => {
                console.log(err);
                await interaction.reply({content: "An error occured while fetching data from the database", ephemeral: true});
            });

    }
});