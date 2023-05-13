import {SlashCommand} from "../../structures/SlashCommand";
import {ExtendedInteraction} from "../../typings/SlashCommand";
import {AttachmentBuilder} from "discord.js";
import {createCanvas} from "canvas";


const getFontSize = async (ctx, maxwidth, text, initialFontSize) => {

    let font = initialFontSize;

    do {
        font -= 10;
        ctx.font = `${font}px "ApoCs" "Arial"`
    } while (ctx.measureText(text).width > maxwidth)

    return [ctx.font, ctx.measureText(text).width];

}


const drawCard = async (ctx, canvas) => {



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






    return new AttachmentBuilder(canvas.toBuffer(), {name: 'rank_card.png'});
}



exports.default = new SlashCommand({
    name: 'rank',
    description: 'Display the rank card',
    run: async ({interaction}) => {

        // creating context
        const canvas = createCanvas(670, 270)
        const ctx = canvas.getContext("2d");

        // drawing card
        let card = await drawCard(ctx, canvas);

        await interaction.reply({files: [card]});

    }
});