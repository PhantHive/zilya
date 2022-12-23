const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({

    userId: String,
    mcNick: String,
    daily: Number,
    lastDaily: Number,
    pheaCoins: Number,
    discoins: Number,
    properties: Array

});

const myDB = mongoose.connection.useDb('phearion');
module.exports = myDB.model('banks', guildSchema);