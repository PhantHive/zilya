"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
const Event_1 = require("../../structures/Event");
const RDB = require("../../assets/utils/models/rank.js");
const updateRank = async (message) => {
    // check if rank exists in db
    let data = await RDB.findOne({
        server_id: `${message.guild.id}`,
        user_id: `${message.author.id}`
    });
    new Promise(async (resolve, reject) => {
        if (!data) {
            // check number of doc in db to set rank
            const nbMembers = await RDB.countDocuments({
                server_id: `${message.guild.id}`
            });
            await new RDB({
                server_id: `${message.guild.id}`,
                user_id: `${message.author.id}`,
                xp_msg: 0,
                level_msg: 1,
                rank_msg: nbMembers + 1,
                xp_vocal: 0,
                level_vocal: 1,
                rank_vocal: nbMembers + 1
            }).save();
            data = await RDB.findOne({
                server_id: `${message.guild.id}`,
                user_id: `${message.author.id}`
            });
            resolve(data);
        }
        else {
            resolve(data);
        }
    })
        .then(async (data) => {
        // console log xp and level before update
        console.log(`xp: ${data.xp_msg} | level: ${data.level_msg}`);
        // = 25 * (curLvl ^ 2) + 15 * curLvl + 25 = nextLvlXp
        const nextLvlXp = 25 * (data.level_msg ** 2) + 15 * data.level_msg + 25;
        // if user has enough xp to level up
        if (data.xp_msg >= nextLvlXp) {
            data.level_msg += 1;
            data.xp_msg = 0;
            await data.save();
        }
        else {
            // take xp randomly in the array [50, 25, 25, 10, 10, 10, 10, 5, 5, 5, 5, 5, 5, 5, 1, 0, 0]
            const xp = [50, 25, 25, 10, 10, 10, 10, 5, 5, 5, 5, 5, 5, 5, 1, 0, 0];
            const random = Math.floor(Math.random() * xp.length);
            data.xp_msg += xp[random];
            await data.save();
        }
        // compare all users in the server and sort them by xp_msg and level_msg then update rank_msg
        const users = await RDB.find({
            server_id: `${message.guild.id}`
        }).sort([
            ['xp_msg', 'descending'],
            ['level_msg', 'descending']
        ]).exec();
        for (let i = 0; i < users.length; i++) {
            users[i].rank_msg = i + 1;
            await users[i].save();
        }
        // console log xp and level after update
        console.log(`xp: ${data.xp_msg} | level: ${data.level_msg}`);
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
