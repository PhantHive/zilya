import mongoose, { Schema } from 'mongoose';

const rankSchema = new Schema({

    serverId: String,
    userId: String,
    xpMsg: Number,
    levelMsg: Number,
    rankMsg: Number,
    xpVocal: Number,
    levelVocal: Number,
    rankVocal: Number

});

const RankModel = mongoose
    .connection
    .useDb('rank')
    .model('ranks', rankSchema);

export default RankModel;