"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("../../index");
const Event_1 = require("../../structures/Event");
const MongoTypes_1 = tslib_1.__importDefault(require("../../typings/MongoTypes"));
const updateRank = async (message) => {
    // check if rank exists in db
    let data = await MongoTypes_1.default.RankModel.findOne({
        serverId: `${message.guild.id}`,
        userId: `${message.author.id}`
    });
    new Promise(async (resolve, reject) => {
        if (!data) {
            // check number of doc in db to set rank
            const nbMembers = await MongoTypes_1.default.RankModel.countDocuments({
                serverId: `${message.guild.id}`
            });
            await new MongoTypes_1.default.RankModel({
                serverId: `${message.guild.id}`,
                userId: `${message.author.id}`,
                xpMsg: 0,
                levelMsg: 1,
                rankMsg: nbMembers + 1,
                xpVocal: 0,
                levelVocal: 1,
                rankVocal: nbMembers + 1
            }).save();
            data = await MongoTypes_1.default.RankModel.findOne({
                serverId: `${message.guild.id}`,
                userId: `${message.author.id}`
            });
            resolve(data);
        }
        else {
            resolve(data);
        }
    })
        .then(async (data) => {
        // console log xp and level before update
        console.log(`xp: ${data.xpMsg} | level: ${data.levelMsg}`);
        // = 25 * (curLvl ^ 2) + 15 * curLvl + 25 = nextLvlXp
        const nextLvlXp = 25 * (data.levelMsg ** 2) + 15 * data.levelMsg + 25;
        // if user has enough xp to level up
        if (data.xpMsg >= nextLvlXp) {
            data.levelMsg += 1;
            data.xpMsg = 0;
            await data.save();
        }
        else {
            // take xp randomly in the array [50, 25, 25, 10, 10, 10, 10, 5, 5, 5, 5, 5, 5, 5, 1, 0, 0]
            const xp = [50, 25, 25, 10, 10, 10, 10, 5, 5, 5, 5, 5, 5, 5, 1, 0, 0];
            const random = Math.floor(Math.random() * xp.length);
            data.xpMsg += xp[random];
            await data.save();
        }
        // compare all users in the server and sort them by xp_msg and level_msg then update rank_msg
        const users = await MongoTypes_1.default.RankModel.find({
            serverId: `${message.guild.id}`
        }).sort([
            ['xp_msg', 'descending'],
            ['level_msg', 'descending']
        ]).exec();
        for (let i = 0; i < users.length; i++) {
            users[i].rankMsg = i + 1;
            await users[i].save();
        }
        // console log xp and level after update
        console.log(`xp: ${data.xpMsg} | level: ${data.levelMsg}`);
    });
};
exports.default = new Event_1.Event('messageCreate', async (message) => {
    // if new message created and last message is not emitted in the last 5 seconds then await updateRank(message);
    if (message.author.bot)
        return;
    if (message.createdTimestamp - index_1.client.lastMessageTimestamp > 10000 || !index_1.client.lastMessageTimestamp) {
        await updateRank(message);
        index_1.client.lastMessageTimestamp = message.createdTimestamp;
    }
});
