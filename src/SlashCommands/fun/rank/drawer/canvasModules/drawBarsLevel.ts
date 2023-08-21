import {Canvas, CanvasRenderingContext2D, Image, loadImage} from "canvas";
import path from "path";
import {TextFormatter} from "../textFormatter";

class DrawBarsLevel extends TextFormatter {

    canvas: any;
    data: any;

    constructor(ctx: CanvasRenderingContext2D, canvas: Canvas, data: any) {
        super(ctx);
        this.ctx = ctx;
        this.canvas = canvas;
        this.data = data;
    }

    async drawBar(x, y, width, height, fillColor) {
        // Draw bar
        // if width is less than 0.002% of the canvas width, don't draw it
        if (width < 0.002 * this.ctx.canvas.width) return;

        // adjust corenerRadius if the width is too small
        const cornerRadius = width < height ? width / 2 : height / 2;

        this.ctx.fillStyle = fillColor;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + cornerRadius);
        this.ctx.quadraticCurveTo(x, y, x + cornerRadius, y);
        this.ctx.lineTo(x + width - cornerRadius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + cornerRadius);
        this.ctx.lineTo(x + width, y + height - cornerRadius);
        this.ctx.quadraticCurveTo(
            x + width,
            y + height,
            x + width - cornerRadius,
            y + height
        );
        this.ctx.lineTo(x + cornerRadius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - cornerRadius);
        this.ctx.closePath();
        this.ctx.fill();
    };

    async drawXpBar() {
        let font: [string, number];
        const nextLvlXpMsg = 25 * this.data.levelMsg ** 2 + 15 * this.data.levelMsg + 25;
        const currentXpMsg = this.data.xpMsg;
        const percentageMsg = currentXpMsg / nextLvlXpMsg;

        const nextLvlXpVocal =
            25 * this.data.levelVocal ** 2 + 15 * this.data.levelVocal + 25;
        const currentXpVocal = this.data.xpVocal;
        const percentageVocal = currentXpVocal / nextLvlXpVocal;

        const msgXpEmoji: Image = await loadImage(
            path.join(__dirname, `../../../../../assets/img/rank-card/msg-xp.png`)
        );
        const vocalXpEmoji: Image = await loadImage(
            path.join(__dirname, `../../../../../assets/img/rank-card/mic-xp.png`)
        );

        // MSG XP BAR
        this.ctx.globalAlpha = 1;
        await this.drawBar(
            this.canvas.width * 0.04,
            this.canvas.height * 0.65,
            this.canvas.width * 0.33,
            17,
            'rgba(0,0,0,0.5)'
        );
        // draw the xp bar
        await this.drawBar(
            this.canvas.width * 0.04,
            this.canvas.height * 0.65,
            this.canvas.width * 0.33 * percentageMsg,
            17,
            'rgba(145,127,127,0.9)'
        );

        // VOCAL XP BAR
        await this.drawBar(
            this.canvas.width * 0.04,
            this.canvas.height * 0.85,
            this.canvas.width * 0.33,
            17,
            'rgba(0,0,0,0.5)'
        );
        // draw the xp bar
        await this.drawBar(
            this.canvas.width * 0.04,
            this.canvas.height * 0.85,
            this.canvas.width * 0.33 * percentageVocal,
            17,
            'rgba(145,127,127,0.9)'
        );

        // draw the xp emoji on the left side
        this.ctx.drawImage(
            msgXpEmoji,
            this.canvas.width * 0.005,
            this.canvas.height * 0.64,
            20,
            20
        );
        this.ctx.drawImage(
            vocalXpEmoji,
            this.canvas.width * 0.0002,
            this.canvas.height * 0.82,
            35,
            30
        );

        // draw the xp text on the center of each bar "currentXpMsg + "/" + nextLvlXpMsg"
        // max width of the text need to be 0.4 of the bar width
        let xpMsgTxt: string = `${currentXpMsg}/${nextLvlXpMsg}`;
        font = await this.getFontSize(this.canvas.width * 0.35 * 0.37, xpMsgTxt as string, 24);
        font[0] = font[0].replace('normal', 'bold');
        this.ctx.font = font[0];
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(xpMsgTxt, this.canvas.width * 0.2, this.canvas.height * 0.705);

        let xpVocalTxt: string = `${currentXpVocal}/${nextLvlXpVocal}`;
        font = await this.getFontSize(this.canvas.width * 0.35 * 0.37, xpVocalTxt, 24);
        font[0] = font[0].replace('normal', 'bold');
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(xpVocalTxt, this.canvas.width * 0.2, this.canvas.height * 0.905);

        this.ctx.restore();

        // add the level text on top left of each bar
        let levelMsgTxt: string = `Lvl: ${this.data.levelMsg}`;
        font = await this.getFontSize(this.canvas.width * 0.15, levelMsgTxt, 27);
        this.ctx.font = font[0];
        this.ctx.fillStyle = '#ffffff';
        // top right of the bar
        this.ctx.textAlign = 'right';
        this.ctx.fillText(levelMsgTxt, this.canvas.width * 0.36, this.canvas.height * 0.63);

        let levelVocalTxt: string = `Lvl: ${this.data.levelVocal}`;
        font = await this.getFontSize(this.canvas.width * 0.15, levelVocalTxt, 27);
        this.ctx.font = font[0];
        this.ctx.fillStyle = '#ffffff';
        // top right
        this.ctx.textAlign = 'right';
        this.ctx.fillText(levelVocalTxt, this.canvas.width * 0.36, this.canvas.height * 0.83);

        // ----------------- RANK -----------------
        let rankMsgTxt: string = `#${this.data.rankMsg}`;
        font = await this.getFontSize(this.canvas.width * 0.11, rankMsgTxt, 27);
        this.ctx.font = font[0];
        this.ctx.fillStyle = '#ffffff';
        // right of the msg bar
        this.ctx.textAlign = 'left';
        this.ctx.fillText(rankMsgTxt, this.canvas.width * 0.38, this.canvas.height * 0.7);

        let rankVocalTxt: string = `#${this.data.rankVocal}`;
        font = await this.getFontSize(this.canvas.width * 0.11, rankVocalTxt, 27);
        this.ctx.font = font[0];
        this.ctx.fillStyle = '#ffffff';
        // right of the vocal bar
        this.ctx.textAlign = 'left';
        this.ctx.fillText(rankVocalTxt, this.canvas.width * 0.38, this.canvas.height * 0.9);
        // -----------------------------------------
    };


}

export default DrawBarsLevel;