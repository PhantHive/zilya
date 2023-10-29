import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CanvasRenderingContext2D } from 'canvas';
import { registerFont } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

registerFont(path.join(__dirname, '../fonts/Broderbund.ttf'), { family: 'Broderbund' });

class TextFormatter {
	public ctx: CanvasRenderingContext2D;

	public constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
	}

	public async getFontSize(
		maxwidth: number,
		text: string,
		initialFontSize: number,
	): Promise<[string, number]> {
		let font = initialFontSize;

		do {
			font -= 5;
			this.ctx.font = `normal ${font}px "Broderbund", "Arial"`;
		} while (this.ctx.measureText(text).width > maxwidth);

		return [this.ctx.font, this.ctx.measureText(text).width];
	}
}

export { TextFormatter };
