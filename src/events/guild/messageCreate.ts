import { client } from '../../index';
import { Event } from '../../structures/Event';
import {
    ExtendedInteraction,
    ExtendedSelectMenuInteraction,
} from '../../typings/SlashCommand';
import { ButtonStyle, ChannelType } from 'discord.js';
import Models from '../../typings/MongoTypes';

const updateRank = async (message) => {
    // check if rank exists in db
    let data = await Models.RankModel.findOne({
        serverId: `${message.guild.id}`,
        userId: `${message.author.id}`,
    });

    new Promise(async (resolve, reject) => {
        if (!data) {
            // check number of doc in db to set rank
            const nbMembers: number = await Models.RankModel.countDocuments({
                serverId: `${message.guild.id}`,
            });

            await new Models.RankModel({
                serverId: `${message.guild.id}`,
                userId: `${message.author.id}`,
                xpMsg: 0,
                levelMsg: 1,
                rankMsg: nbMembers + 1,
                xpVocal: 0,
                levelVocal: 1,
                rankVocal: nbMembers + 1,
            }).save();

            data = await Models.RankModel.findOne({
                serverId: `${message.guild.id}`,
                userId: `${message.author.id}`,
            });
            resolve(data);
        } else {
            resolve(data);
        }
    }).then(async (data: any) => {
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
            const xp = [
                50, 25, 25, 10, 10, 10, 10, 5, 5, 5, 5, 5, 5, 5, 1, 0, 0,
            ];
            const random = Math.floor(Math.random() * xp.length);
            data.xpMsg += xp[random];
            await data.save();
        }

        // compare all users in the server and sort them by xp_msg and level_msg then update rank_msg
        const users = await Models.RankModel.find({
            serverId: `${message.guild.id}`,
        })
            .sort([
                ['xp_msg', 'descending'],
                ['level_msg', 'descending'],
            ])
            .exec();

        for (let i = 0; i < users.length; i++) {
            users[i].rankMsg = i + 1;
            await users[i].save();
        }

        // console log xp and level after update
        console.log(`xp: ${data.xpMsg} | level: ${data.levelMsg}`);
    });
};

export default new Event('messageCreate', async (message) => {
    // if new message created and last message is not emitted in the last 5 seconds then await updateRank(message);
    if (message.author.bot) return;

    if (
        message.createdTimestamp - client.lastMessageTimestamp > 10000 ||
        !client.lastMessageTimestamp
    ) {
        await updateRank(message);
        client.lastMessageTimestamp = message.createdTimestamp;
    }
});
