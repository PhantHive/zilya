import { client } from '../../index';
import { Event } from '../../structures/Event';
import { ExtendedInteraction, ExtendedSelectMenuInteraction } from '../../typings/SlashCommand';
import {ButtonStyle, ChannelType, CommandInteractionOptionResolver} from "discord.js";
const RDB = require("../../assets/utils/models/rank.js");



const updateRank = async (message) => {

    // check if rank exists in db
    let data = await RDB.findOne({
        server_id: `${message.guild.id}`,
        user_id: `${message.author.id}`
    });


    // make a promise that will check if data exist, if not, create it, then
    // update it whatever if it exists or not as it will be created
    new Promise(async (resolve, reject) => {
        if (!data) {
            await new RDB({
                server_id: `${message.guild.id}`,
                user_id: `${message.author.id}`,
                xp_msg: 0,
                level_msg: 1,
                xp_vocal: 0,
                level_vocal: 1
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
        .then(async (data: any) => {
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

        // console log xp and level after update
        console.log(`xp: ${data.xp_msg} | level: ${data.level_msg}`);
    });


}

export default new Event('messageCreate', async (message) => {

    // if new message created and last message is not emitted in the last 5 seconds then await updateRank(message);
    if (message.author.bot) return;

    if (message.createdTimestamp - client.lastMessageTimestamp > 10000 || !client.lastMessageTimestamp) {
        await updateRank(message);
        client.lastMessageTimestamp = message.createdTimestamp;
    }
});