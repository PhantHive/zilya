import {CanvasRenderingContext2D, registerFont} from "canvas";
import path from "path";
registerFont(
    path.join(__dirname, '../fonts/Broderbund.ttf'),
    { family: 'Broderbund' }
);

class TextFormatter {

    ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    async getFontSize(maxwidth: number, text: string, initialFontSize: number): Promise<[string, number]> {
        let font = initialFontSize;

        do {
            font -= 5;
            this.ctx.font = `normal ${font}px "Broderbund", "Arial"`;
        } while (this.ctx.measureText(text).width > maxwidth);

        return [this.ctx.font, this.ctx.measureText(text).width];
    }

}

export {TextFormatter}
