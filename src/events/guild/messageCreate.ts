import type { Message } from 'discord.js';
import RankModel from '../../assets/utils/models/Rank';
import { Event } from '../../structures/Event';
import type { IRankDocument } from '../../typings/MongoTypes';

const getUserDataRank = async (message: Message<boolean>) => {
	if (!message.guild || !message.member) return;
	let data = await RankModel.findOne<IRankDocument>({
		serverId: `${message.guild.id}`,
		userId: `${message.member.user.id}`,
	});

	if (!data) {
		// check number of doc in db to set rank
		const nbMembers: number = await RankModel.countDocuments({
			serverId: `${message.guild.id}`,
		});

		await new RankModel({
			serverId: `${message.guild.id}`,
			userId: `${message.author.id}`,
			xpMsg: 0,
			levelMsg: 1,
			rankMsg: nbMembers + 1,
			xpVocal: 0,
			levelVocal: 1,
			rankVocal: nbMembers + 1,
		}).save();

		data = await RankModel.findOne<IRankDocument>({
			serverId: `${message.guild.id}`,
			userId: `${message.author.id}`,
		});
	}

	return data;
};

const updateRank = async (message: Message) => {
	const data = await getUserDataRank(message);
	if (!message.guild) return;
	if (!data) {
		console.log(
			`Error: no data found for the user ${message.author.id} in the server ${message.guild.id}`,
		);
		return;
	}

	// console log xp and level before update
	console.log(`xp: ${data.xpMsg} | level: ${data.levelMsg}`);

	// = 25 * (curLvl ^ 2) + 15 * curLvl + 25 = nextLvlXp
	const nextLvlXp = 25 * data.levelMsg ** 2 + 15 * data.levelMsg + 25;

	// if user has enough xp to level up
	if (data.xpMsg >= nextLvlXp) {
		data.levelMsg += 1;
		data.xpMsg = 0;
		await data.save();
	} else {
		// take xp randomly in the array [50, 25, 25, 10, 10, 10, 10, 5, 5, 5, 5, 5, 5, 5, 1, 0, 0]
		const xp: number[] = [50, 25, 25, 10, 10, 10, 10, 5, 5, 5, 5, 5, 5, 5, 1, 0, 0];
		const random: number = Math.floor(Math.random() * xp.length);
		const xpValue = xp[random];
		if (xpValue) data.xpMsg += xpValue;
	}

	// compare all users in the server and sort them by xp_msg and level_msg then update rank_msg
	const users = await RankModel.find({
		serverId: `${message.guild.id}`,
	})
		.sort([
			['xp_msg', 'descending'],
			['level_msg', 'descending'],
		])
		.exec();

	for (const [count, user] of users.entries()) {
		user.rankMsg = count + 1;
		await user.save();
	}

	// console log xp and level after update
	console.log(`xp: ${data.xpMsg} | level: ${data.levelMsg}`);
};

export default new Event('messageCreate', async (client, message) => {
	if (message.author.bot) return;

	const now = Date.now();

	if (client.lastMessageTimestamp === undefined || now - client.lastMessageTimestamp > 10_000) {
		client.lastMessageTimestamp = now;
		await updateRank(message);
	}
});
