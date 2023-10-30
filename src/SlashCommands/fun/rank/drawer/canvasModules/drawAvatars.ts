import type { Canvas, CanvasRenderingContext2D, Image } from 'canvas';
import { createCanvas, loadImage } from 'canvas';
import type { BaseImageURLOptions } from 'discord.js';
import type { ExtendedInteraction } from '../../../../../typings/SlashCommand';

class DrawAvatars {
	public ctx: CanvasRenderingContext2D;

	public canvas: Canvas;

	public interaction: ExtendedInteraction;

	public constructor(
		ctx: CanvasRenderingContext2D,
		canvas: Canvas,
		interaction: ExtendedInteraction,
	) {
		this.ctx = ctx;
		this.canvas = canvas;
		this.interaction = interaction;
	}

	public async drawAvatar() {
		this.ctx.globalAlpha = 1;
		this.ctx.save();
		// draw the avatar

		const avatarCanvas = createCanvas(this.canvas.width, this.canvas.height);

		const avatarCtx = avatarCanvas.getContext('2d');

		const avatarUrl = this.interaction.member.displayAvatarURL({
			extension: 'png',
			forceStatic: false,
			size: 2_048,
		} as BaseImageURLOptions);
		let avatar: Image | undefined;
		async function loadAvatar(): Promise<void> {
			avatar = await loadImage(avatarUrl);
		}

		const imageWidth = this.canvas.height * 0.6;
		const imageHeight = this.canvas.height * 0.6;
		await loadAvatar();
		const offsetX = this.canvas.width * 0.62 - imageWidth / 2;
		const offsetY = (this.canvas.height * 0.6) / 2 + this.canvas.height * 0.4 - imageHeight / 2;

		// create canvas for the avatar

		avatarCtx.beginPath();
		avatarCtx.lineWidth = 2;
		avatarCtx.strokeStyle = '#b7a4a4';
		avatarCtx.arc(
			this.canvas.width * 0.62,
			(this.canvas.height * 0.6) / 2 + this.canvas.height * 0.4,
			imageWidth / 2,
			0,
			Math.PI * 2,
			false,
		);
		avatarCtx.closePath();
		avatarCtx.stroke();
		avatarCtx.clip();

		if (!avatar) throw new Error('Avatar not found');
		avatarCtx.drawImage(avatar, offsetX, offsetY, imageWidth, imageHeight);

		this.ctx.drawImage(avatarCanvas, 0, 0, this.canvas.width, this.canvas.height);
	}

	public async drawServerIcon() {
		const serverIconUrl = this.interaction.guild?.iconURL({
			extension: 'png',
			forceStatic: false,
			size: 2_048,
		} as BaseImageURLOptions);

		let serverIcon: Image | undefined;
		async function loadServerIcon(): Promise<void> {
			if (!serverIconUrl) throw new Error('Server icon not found');
			serverIcon = await loadImage(serverIconUrl);
		}

		await loadServerIcon();

		if (!serverIcon) throw new Error('Server icon not found');
		// draw server icon inside the circle
		this.ctx.beginPath();
		this.ctx.lineWidth = 2;
		this.ctx.strokeStyle = '#b7a4a4';
		this.ctx.drawImage(serverIcon, this.canvas.width * 0.8, this.canvas.height * 0.7, 40, 40);
		this.ctx.arc(
			this.canvas.width * 0.8 + 20,
			this.canvas.height * 0.7 + 20,
			20,
			0,
			Math.PI * 2,
			false,
		);
		this.ctx.closePath();
		this.ctx.stroke();
	}
}

export default DrawAvatars;
