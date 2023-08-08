const colors = require("./colors.json");
const { loadImage } = require("canvas");

const drawTopCard = async (ctx, canvas, profile) => {

    const topChampAvatar = await loadImage(profile.champAvatar)


    ctx.save();
    ctx.moveTo(5, 0);
    ctx.arcTo(canvas.width - 5, 0, canvas.width - 5, canvas.height - 5, 25);
    ctx.arcTo(canvas.width - 5, canvas.height - 5, 0, canvas.height - 5, 25);
    ctx.arcTo(0, canvas.height - 5, 0, 0, 25);
    ctx.arcTo(0, 0, canvas.width - 5, 0, 25);
    ctx.clip();

    ctx.beginPath();
    ctx.fillStyle = colors["topCard"]["main"]
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.closePath();

    ctx.beginPath();
    ctx.lineWidth = 25;
    ctx.strokeStyle = colors["topCard"]["lines"];
    ctx.moveTo(0, canvas.height * 0.1);
    ctx.quadraticCurveTo(canvas.width * 0.5, canvas.height * 0.20, canvas.width, canvas.height * 0.1);
    ctx.moveTo(canvas.width, canvas.height * 0.1);
    ctx.lineTo(canvas.width, canvas.height * 0.90);
    ctx.quadraticCurveTo(canvas.width * 0.5, canvas.height * 0.80, 0, canvas.height * 0.90);
    ctx.lineTo(0, canvas.height * 0.1);
    //temp
    /*
    ctx.moveTo(0, canvas.height * 0.15)
    ctx.lineTo(0, canvas.height * 0.85)
    ctx.quadraticCurveTo(canvas.width * 0.5, canvas.height * 0.95, canvas.width, canvas.height * 0.85);
    ctx.stroke();*/
    ctx.stroke();
    ctx.clip()

    ctx.drawImage(topChampAvatar, 0, canvas.height * 0.1, canvas.width, canvas.height);

    ctx.closePath();


}


export {

    drawTopCard

}