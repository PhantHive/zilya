/* eslint-disable require-atomic-updates */
import type { Canvas, CanvasRenderingContext2D } from 'canvas';
import { loadImage } from 'canvas';
import colors from '../../../../../assets/data/paladinsColors.json' assert { type: 'json' };
import { TextFormatter } from '../../../../../assets/utils/textFormatter';
import type { PaladinsProfile } from '../../../../../typings/PaladinsTypes';

const drawCard = async (
	ctx: CanvasRenderingContext2D,
	canvas: Canvas,
	profile: PaladinsProfile,
) => {
	const topChampAvatar = await loadImage(profile.champAvatar);
	const textFormatter = new TextFormatter(ctx);

	ctx.save();
	ctx.moveTo(5, 0);
	ctx.arcTo(canvas.width - 5, 0, canvas.width - 5, canvas.height - 5, 25);
	ctx.arcTo(canvas.width - 5, canvas.height - 5, 0, canvas.height - 5, 25);
	ctx.arcTo(0, canvas.height - 5, 0, 0, 25);
	ctx.arcTo(0, 0, canvas.width - 5, 0, 25);
	ctx.clip();

	ctx.beginPath();
	ctx.fillStyle = colors.card.main;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.closePath();

	ctx.beginPath();
	ctx.lineWidth = 30;
	ctx.strokeStyle = colors.card.lines;
	ctx.moveTo(canvas.width, canvas.height * 0.15);
	ctx.quadraticCurveTo(
		canvas.width * 0.5,
		canvas.height * 0.1,
		canvas.width * 0.4,
		canvas.height * 0.5,
	);
	ctx.quadraticCurveTo(
		canvas.width * 0.32,
		canvas.height * 0.7,
		canvas.width * 0.1,
		canvas.height * 0.7,
	);
	ctx.quadraticCurveTo(canvas.width * 0.02, canvas.height * 0.7, 0, canvas.height * 0.72);
	ctx.lineTo(0, canvas.height);
	ctx.lineTo(canvas.width, canvas.height);
	ctx.lineTo(canvas.width, canvas.height * 0.15);
	ctx.stroke();
	ctx.clip();
	ctx.fillStyle = colors.card.text;

	const font = await textFormatter.getFontSize(canvas.width * 0.4, profile.mostPlayedChamp, 200);
	ctx.font = font[0];
	ctx.drawImage(topChampAvatar, 0, canvas.height * 0.1, canvas.width, canvas.height);
	ctx.fillText(`#${profile.mostPlayedChamp}`, canvas.width * 0.9 - font[1], canvas.height * 0.97);
	ctx.closePath();

	ctx.restore();
};

const drawStats = async (
	ctx: CanvasRenderingContext2D,
	canvas: Canvas,
	profile: PaladinsProfile,
) => {
	const playerAvatar = await loadImage(profile.userAvatar);
	const textFormatter = new TextFormatter(ctx);

	ctx.beginPath();
	ctx.save();
	ctx.shadowColor = colors.card.shadow;
	ctx.shadowBlur = 5;
	ctx.lineWidth = 20;
	ctx.strokeStyle = colors.card.lines;
	ctx.arc(canvas.width * 0.22, canvas.height * 0.18, 215, 0, 2 * Math.PI, false);
	ctx.stroke();
	ctx.clip();

	ctx.drawImage(
		playerAvatar,
		canvas.width * 0.22 - 435 / 2,
		canvas.height * 0.18 - 435 / 2,
		435,
		435,
	);

	ctx.closePath();

	ctx.restore();

	ctx.beginPath();
	ctx.shadowColor = colors.card.shadow;
	ctx.shadowBlur = 5;
	ctx.fillStyle = colors.card.text;

	// nickname
	const nameFont = await textFormatter.getFontSize(canvas.width * 0.4, profile.name, 155);
	ctx.font = nameFont[0];
	const metrics = ctx.measureText(profile.name);
	const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
	ctx.fillText(
		profile.name,
		canvas.width - nameFont[1] - canvas.width * 0.22 + 215,
		canvas.height * 0.18 - 215 + actualHeight,
	);

	const levelFont = await textFormatter.getFontSize(
		canvas.width * 0.4,
		`Lvl: ${profile.level}`,
		100,
	);
	ctx.font = levelFont[0];
	ctx.fillText(`Lvl: ${profile.level}`, canvas.width * 0.22 - 435 / 2, canvas.height * 0.45);
	ctx.fillText(`${profile.hoursPlayed} H`, canvas.width * 0.22 - 435 / 2, canvas.height * 0.52);
	ctx.fillText(`${profile.wins} W`, canvas.width * 0.22 - 435 / 2, canvas.height * 0.59);
	ctx.closePath();
};

export { drawCard, drawStats };
