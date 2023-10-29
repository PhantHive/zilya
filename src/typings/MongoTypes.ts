import type { Document } from 'mongoose';

export interface IWelcomeDocument extends Document {
	channelId: string;
	color: string;
	isEdit: boolean;
	serverId: string;
	theme: number;
}

export interface ILoggerDocument extends Document {
	color: string;
	logChannel: string;
	notifType: string;
	serverId: string;
}

export interface IRankDocument extends Document {
	levelMsg: number;
	levelVocal: number;
	rankMsg: number;
	rankVocal: number;
	serverId: string;
	userId: string;
	xpMsg: number;
	xpVocal: number;
}
