import type { Canvas, CanvasRenderingContext2D } from 'canvas';
import { AttachmentBuilder } from 'discord.js';
import { TextFormatter } from '../../../../assets/utils/textFormatter';
import type { IRankDocument } from '../../../../typings/MongoTypes.ts';
import type { ExtendedInteraction } from '../../../../typings/SlashCommand';
import DrawAvatars from './canvasModules/drawAvatars';
import DrawBarsLevel from './canvasModules/drawBarsLevel';
import DrawCardShape from './canvasModules/drawCardShape';

class DrawRankCard extends TextFormatter {
	public canvas: Canvas;

	public data: IRankDocument;

	public interaction: ExtendedInteraction;

	public constructor(
		ctx: CanvasRenderingContext2D,
		canvas: Canvas,
		data: IRankDocument,
		interaction: ExtendedInteraction,
	) {
		super(ctx);
		this.ctx = ctx;
		this.canvas = canvas;
		this.data = data;
		this.interaction = interaction;
	}

	public async drawCard() {
		const shapeDrawer = new DrawCardShape(this.ctx, this.canvas);
		const avatarsDrawer = new DrawAvatars(this.ctx, this.canvas, this.interaction);
		const drawBarsLevel = new DrawBarsLevel(this.ctx, this.canvas, this.data);

		// draw the shape of the card
		await shapeDrawer.drawShape();
		// draw the avatars
		await avatarsDrawer.drawAvatar();
		await avatarsDrawer.drawServerIcon();

		// draw the text inside the card
		this.ctx.fillStyle = '#ffffff';
		let font: [string, number] = await this.getFontSize(
			this.canvas.width * 0.2,
			`${this.interaction.user.username}`,
			75,
		);
		this.ctx.font = font[0];
		this.ctx.fillText(
			`${this.interaction.user.username}`,
			this.canvas.width * 0.025,
			this.canvas.height * 0.45,
		);

		// draw xp bar
		await drawBarsLevel.drawXpBar();

		// draw global rank of serv, msg and vocal / 2
		const globalRank = (this.data.rankMsg + this.data.rankVocal) / 2;

		// draw the global rank
		const globalRankTxt = `#${globalRank}`;
		font = await this.getFontSize(this.canvas.width * 0.15, globalRankTxt, 50);
		this.ctx.font = font[0];
		this.ctx.fillStyle = '#ffffff';
		// top right
		this.ctx.textAlign = 'left';
		const textWidth: number = this.canvas.width * 0.85 - font[1] / 2;
		this.ctx.fillText(globalRankTxt, textWidth, this.canvas.height * 0.42);

		return new AttachmentBuilder(this.canvas.toBuffer(), { name: 'rank_card.png' });
	}
}

export { DrawRankCard };
