import mongoose, { Schema } from 'mongoose';

const phearionSchema = new Schema({
    userId: String,
    mcNick: String,
    daily: Number,
    lastDaily: Number,
    pheaCoins: Number,
    discoins: Number,
    properties: Array,
});

const PhearionModel = mongoose.connection
    .useDb('phearion')
    .model('banks', phearionSchema);

export default PhearionModel;
