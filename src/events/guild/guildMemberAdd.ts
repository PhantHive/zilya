import { readdir } from 'node:fs/promises';
import path from 'node:path';
import type { Canvas, Image } from 'canvas';
import { createCanvas, loadImage } from 'canvas';
import { TextChannel } from 'discord.js';
import themes from '../../assets/data/theme.json' assert { type: 'json' };
import WelcomeModel from '../../assets/utils/models/Welcome';
import { client } from '../../index';
import { Event } from '../../structures/Event';
import type { IWelcomeDocument } from '../../typings/MongoTypes';
import type { MyAttachmentData } from '../../typings/SlashCommand';

const applyText = (
	canvas: Canvas,
	text: string,
	fontSize: number | null = null,
	maxPercentWidth: number | null = null,
): [string, number] => {
	const ctx = canvas.getContext('2d');

	if (fontSize === null) {
		fontSize = 65;
	}

	if (maxPercentWidth === null) {
		maxPercentWidth = 0.52;
	}

	do {
		// Assign the font to the context and decrement it so it can be measured again
		ctx.font = `italic bold ${(fontSize -= 2)}px Tahoma`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (ctx.measureText(text).width > canvas.width * maxPercentWidth);

	// Return the result to use in the actual canvas
	return [ctx.font, ctx.measureText(text).width];
};

export default new Event('guildMemberAdd', async (member) => {
	const data = await WelcomeModel.findOne<IWelcomeDocument>({
		serverId: member.guild.id,
	});

	if (!data) {
		console.log('no data...');
		return;
	}

	const theme = themes.find((theme) => theme.value === data.theme);
	if (!theme) {
		console.log('theme not found...');
		return;
	}

	const generalPath = path.join(__dirname, `../../assets/img/welcome/${theme.name}`);
	const rand_back: string[] = [];
	try {
		const files = await readdir(generalPath);
		for (const file of files) {
			rand_back.push(`${generalPath}/${file}`);
		}
	} catch (error) {
		console.error('Error reading directory:', error);
	}

	const system = data.channelId;

	const canvas = createCanvas(800, 450);
	const ctx = canvas.getContext('2d');

	if (!rand_back.length) return;

	const randomIndex = Math.floor(Math.random() * rand_back.length);
	const randomBackgroundPath = rand_back[randomIndex];
	if (!randomBackgroundPath) {
		console.error('Unexpected error: random background path is undefined.');
		return;
	}

	const background: Image = await loadImage(randomBackgroundPath);
	const guildColor = '#ffffff';
	const guildStroke: string = data.color;

	ctx.save();

	// GLOBAL SHAPE
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(canvas.width, 0);
	// right top arc
	ctx.quadraticCurveTo(
		0.95 * canvas.width,
		0.1 * canvas.height,
		canvas.width,
		0.15 * canvas.height,
	);
	// line to bottom right
	ctx.lineTo(canvas.width, 0.85 * canvas.height);
	// right bottom arc
	ctx.quadraticCurveTo(0.95 * canvas.width, 0.9 * canvas.height, canvas.width, canvas.height);
	// line to bottom left
	ctx.lineTo(0, canvas.height);
	// left bottom arc
	ctx.quadraticCurveTo(0.05 * canvas.width, 0.9 * canvas.height, 0, 0.85 * canvas.height);
	// line to top left
	ctx.lineTo(0, 0.15 * canvas.height);
	// left top arc
	ctx.quadraticCurveTo(0.05 * canvas.width, 0.1 * canvas.height, 0, 0);
	ctx.closePath();

	ctx.clip();

	ctx.globalAlpha = 0.55;
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.restore();

	ctx.lineWidth = 5;
	ctx.strokeStyle = guildStroke;
	ctx.stroke();

	// draw same shape inside the canvas starting from the top left corner at 0.05*canvas.width, 0.1*canvas.height
	ctx.beginPath();
	ctx.moveTo(0.05 * canvas.width, 0.1 * canvas.height);
	ctx.lineTo(0.95 * canvas.width, 0.1 * canvas.height);
	// right top arc
	ctx.quadraticCurveTo(
		0.94 * canvas.width,
		0.14 * canvas.height,
		0.95 * canvas.width,
		0.15 * canvas.height,
	);
	// line to bottom right
	ctx.lineTo(0.95 * canvas.width, 0.85 * canvas.height);
	// right bottom arc
	ctx.quadraticCurveTo(
		0.94 * canvas.width,
		0.86 * canvas.height,
		0.95 * canvas.width,
		0.9 * canvas.height,
	);
	// line to bottom left
	ctx.lineTo(0.05 * canvas.width, 0.9 * canvas.height);
	// left bottom arc
	ctx.quadraticCurveTo(
		0.06 * canvas.width,
		0.86 * canvas.height,
		0.05 * canvas.width,
		0.85 * canvas.height,
	);
	// line to top left
	ctx.lineTo(0.05 * canvas.width, 0.15 * canvas.height);
	// left top arc
	ctx.quadraticCurveTo(
		0.06 * canvas.width,
		0.14 * canvas.height,
		0.05 * canvas.width,
		0.1 * canvas.height,
	);

	ctx.lineWidth = 1;
	ctx.strokeStyle = guildStroke;
	ctx.stroke();

	ctx.closePath();

	ctx.restore();

	ctx.beginPath();

	// write Pseudo with tag on the right of the avatar a little bit on the top
	// strong shadow on the two text above
	ctx.shadowColor = '#000000';
	ctx.shadowBlur = 15;
	ctx.shadowOffsetX = 2;
	ctx.shadowOffsetY = 2;

	ctx.font = applyText(canvas, member.user.tag, null, 0.45)[0] as string;
	ctx.fillStyle = guildColor;
	ctx.fillText(member.user.tag, 0.4 * canvas.width, 0.5 * canvas.height);

	// make outline

	ctx.lineWidth = 1;
	ctx.strokeStyle = '#000000';
	ctx.strokeText(member.user.tag, 0.4 * canvas.width, 0.5 * canvas.height);
	ctx.closePath();

	ctx.restore();

	ctx.beginPath();
	// tiny shadow to show better text
	ctx.shadowColor = 'rgba(0,0,0,0.5)';
	ctx.shadowBlur = 10;
	ctx.shadowOffsetX = 5;
	ctx.shadowOffsetY = 5;

	// write "to: server name" below the pseudo with a smaller font
	ctx.font = applyText(canvas, 'to:', 40)[0];
	ctx.fillStyle = guildStroke;
	ctx.fillText('to:', 0.4 * canvas.width, 0.6 * canvas.height);
	// stroke the text
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#000000';
	ctx.strokeText('to:', 0.4 * canvas.width, 0.6 * canvas.height);

	// write server name below the pseudo with a smaller font after "to:"
	ctx.font = applyText(canvas, member.guild.name, 45, 0.43)[0];
	ctx.fillStyle = guildColor;
	ctx.fillText(member.guild.name, 0.485 * canvas.width, 0.6 * canvas.height);
	// stroke the text
	ctx.lineWidth = 0.7;
	ctx.strokeStyle = '#000000';
	ctx.strokeText(member.guild.name, 0.485 * canvas.width, 0.6 * canvas.height);

	ctx.closePath();

	ctx.restore();

	ctx.beginPath();
	ctx.shadowColor = 'rgba(0,0,0,0.94)';
	ctx.shadowBlur = 10;
	ctx.shadowOffsetX = 2;
	ctx.shadowOffsetY = 2;

	// write "BOARDING PASS" in bottom between the bottom line and the bottom of the canva
	let font = applyText(canvas, 'BOARDING PASS', 42);
	ctx.font = font[0];
	ctx.fillStyle = guildColor;
	ctx.fillText('BOARDING PASS', 0.5 * canvas.width - font[1] / 2, 0.98 * canvas.height);
	// stroke the text
	ctx.lineWidth = 0.5;
	ctx.strokeStyle = '#000000';
	ctx.strokeText('BOARDING PASS', 0.5 * canvas.width - font[1] / 2, 0.98 * canvas.height);

	// write "WELCOME" in top between the top line and the top of the canva
	font = applyText(canvas, 'WELCOME', 50);
	ctx.font = font[0];
	ctx.fillStyle = guildColor;
	ctx.fillText('WELCOME', 0.5 * canvas.width - font[1] / 2, 0.09 * canvas.height);
	// stroke the text
	ctx.lineWidth = 0.5;
	ctx.strokeStyle = '#000000';
	ctx.strokeText('WELCOME', 0.5 * canvas.width - font[1] / 2, 0.09 * canvas.height);

	ctx.closePath();

	ctx.restore();

	ctx.beginPath();
	// write from top to bottom "Z" "L" "7" "7" "7" on the right between the right line and the right of the canvas
	font = applyText(canvas, 'Z', 40);
	ctx.font = font[0];
	ctx.fillStyle = guildColor;
	font = applyText(canvas, 'L', 40);
	ctx.fillText('Z', 0.971 * canvas.width - font[1] / 2, 0.3 * canvas.height);
	ctx.font = font[0];
	ctx.fillStyle = guildColor;
	font = applyText(canvas, '7', 40);
	ctx.fillText('L', 0.971 * canvas.width - font[1] / 2, 0.4 * canvas.height);
	ctx.font = font[0];
	ctx.fillStyle = guildColor;
	font = applyText(canvas, '7', 40);
	ctx.fillText('7', 0.971 * canvas.width - font[1] / 2, 0.5 * canvas.height);
	ctx.font = font[0];
	ctx.fillStyle = guildColor;
	font = applyText(canvas, '7', 40);
	ctx.fillText('7', 0.971 * canvas.width - font[1] / 2, 0.6 * canvas.height);
	ctx.font = font[0];
	ctx.fillStyle = guildColor;
	ctx.strokeStyle = 'rgb(0,0,0)';
	ctx.fillText('7', 0.971 * canvas.width - font[1] / 2, 0.7 * canvas.height);

	ctx.lineWidth = 0.7;
	ctx.strokeText('Z', 0.971 * canvas.width - font[1] / 2, 0.3 * canvas.height);
	ctx.strokeText('L', 0.971 * canvas.width - font[1] / 2, 0.4 * canvas.height);
	ctx.strokeText('7', 0.971 * canvas.width - font[1] / 2, 0.5 * canvas.height);
	ctx.strokeText('7', 0.971 * canvas.width - font[1] / 2, 0.6 * canvas.height);
	ctx.strokeText('7', 0.971 * canvas.width - font[1] / 2, 0.7 * canvas.height);

	ctx.closePath();
	ctx.restore();

	ctx.beginPath();
	// add glow effect to the text
	ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.shadowBlur = 7;

	// show nicely count member below the avatar
	ctx.font = applyText(canvas, `#${member.guild.memberCount}`, 35)[0];
	ctx.fillStyle = guildColor;
	ctx.fillText(`#${member.guild.memberCount}`, 0.07 * canvas.width, 0.87 * canvas.height);
	ctx.closePath();

	ctx.restore();
	// draw circle avatar on the left centered vertically
	ctx.beginPath();
	ctx.arc(0.25 * canvas.width, 0.5 * canvas.height, 0.12 * canvas.width, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	// ctx.shadowBlur = 0;
	const avatar = await loadImage(member.user.displayAvatarURL({ extension: 'png' }));
	// draw avatar based on the circle
	ctx.drawImage(
		avatar,
		0.12 * canvas.width,
		0.28 * canvas.height,
		0.25 * canvas.width,
		0.25 * canvas.width,
	);

	ctx.lineWidth = 7;
	ctx.strokeStyle = guildStroke;
	ctx.stroke();

	// create attachment using interface AttachmentData
	const attachment: MyAttachmentData = {
		attachment: canvas.toBuffer(),
		name: 'welcome-image.png',
	};

	const systemChannel = await client.channels.fetch(system);
	if (!systemChannel || !(systemChannel instanceof TextChannel)) return;
	await systemChannel.send({ files: [attachment] });
});
