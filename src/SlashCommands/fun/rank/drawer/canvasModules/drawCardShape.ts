import path from 'node:path';
import type { Canvas, CanvasRenderingContext2D } from 'canvas';
import { loadImage } from 'canvas';

class DrawCardShape {
	public ctx: CanvasRenderingContext2D;

	public canvas: any;

	public constructor(ctx: CanvasRenderingContext2D, canvas: Canvas) {
		this.ctx = ctx;
		this.canvas = canvas;
	}

	public async drawShape() {
		this.ctx.strokeStyle = '#b7a4a4';
		this.ctx.lineWidth = 1.2;

		// left side
		this.ctx.beginPath();
		this.ctx.moveTo(0, 0);
		this.ctx.lineTo(0, this.canvas.height);
		this.ctx.lineTo(365, this.canvas.height);
		// left curve of the profile pic. (left part of the card)
		// --------------------
		this.ctx.quadraticCurveTo(
			365 * 0.75,
			(this.canvas.height * 0.6) / 2 + this.canvas.height * 0.4,
			365,
			this.canvas.height * 0.4,
		);
		this.ctx.quadraticCurveTo(
			365 * 0.84,
			this.canvas.height * 0.3,
			365 * 0.7,
			this.canvas.height * 0.37,
		); // arrival 361*0.70, canvas.height * 0.35
		this.ctx.quadraticCurveTo(
			365 * 0.47,
			this.canvas.height * 0.45,
			365 * 0.35,
			this.canvas.height * 0.2,
		);
		// --------------------
		this.ctx.lineTo(365 * 0.28, this.canvas.height * 0.07);
		// --------------------
		this.ctx.quadraticCurveTo(365 * 0.24, this.canvas.height * 0.01, 365 * 0.1, 0);
		// --------------------
		this.ctx.lineTo(0, 0);

		// --------------------
		// PROFILE PIC
		this.ctx.moveTo(
			this.canvas.width * 0.62,
			(this.canvas.height * 0.6) / 2 + this.canvas.height * 0.4,
		); // go to the middle of the profile pic
		this.ctx.arc(
			this.canvas.width * 0.62,
			(this.canvas.height * 0.6) / 2 + this.canvas.height * 0.4,
			this.canvas.height * 0.3,
			0,
			Math.PI * 2,
			false,
		);

		// --------------------

		// right side bottom leaf
		this.ctx.moveTo(this.canvas.width * 0.715, this.canvas.height * 0.45);
		// make the quadratic in the opposite way
		this.ctx.quadraticCurveTo(
			this.canvas.width * 0.81,
			(this.canvas.height * 0.6) / 2 + this.canvas.height * 0.45,
			this.canvas.width * 0.7,
			this.canvas.height,
		);
		this.ctx.lineTo(this.canvas.width * 0.77, this.canvas.height);
		this.ctx.quadraticCurveTo(
			this.canvas.width * 0.81,
			this.canvas.height,
			this.canvas.width * 0.85,
			this.canvas.height * 0.92,
		);
		this.ctx.quadraticCurveTo(
			this.canvas.width * 0.91,
			this.canvas.height * 0.82,
			this.canvas.width * 0.96,
			this.canvas.height * 0.92,
		);
		this.ctx.lineTo(this.canvas.width, this.canvas.height);
		this.ctx.quadraticCurveTo(
			this.canvas.width * 0.91,
			this.canvas.height * 0.5,
			this.canvas.width * 0.715,
			this.canvas.height * 0.45,
		);

		// top leaf
		this.ctx.moveTo(this.canvas.width * 0.75, this.canvas.height * 0.46);
		this.ctx.lineTo(this.canvas.width * 0.77, this.canvas.height * 0.35);
		this.ctx.quadraticCurveTo(
			this.canvas.width * 0.8,
			this.canvas.height * 0.2,
			this.canvas.width * 0.9,
			this.canvas.height * 0.15,
		);
		// // opposite angle of the above leaf
		this.ctx.quadraticCurveTo(
			this.canvas.width * 0.95,
			this.canvas.height * 0.4,
			this.canvas.width * 0.93,
			this.canvas.height * 0.5,
		);
		this.ctx.lineTo(this.canvas.width * 0.9, this.canvas.height * 0.65);
		this.ctx.quadraticCurveTo(
			this.canvas.width * 0.85,
			this.canvas.height * 0.52,
			this.canvas.width * 0.75,
			this.canvas.height * 0.46,
		);
		this.ctx.closePath();

		this.ctx.clip();
		this.ctx.stroke();

		this.ctx.save();

		// draw the background
		this.ctx.globalAlpha = 0.45;
		const background = await loadImage(
			path.join(
				__dirname,
				'..',
				'..',
				'..',
				'..',
				'..',
				'assets',
				'img',
				'welcome',
				'landscapes',
				'landscape-2.jpg',
			),
		);
		this.ctx.drawImage(background, 0, 0, this.canvas.width, this.canvas.height);
	}
}

export default DrawCardShape;
