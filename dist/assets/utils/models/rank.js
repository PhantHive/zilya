const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({

    server_id: String,
    user_id: String,
    xp_msg: Number,
    level_msg: Number,
    rank_msg: Number,
    xp_vocal: Number,
    level_vocal: Number,
    rank_vocal: Number

});

const myDB = mongoose.connection.useDb('rank');
module.exports = myDB.model('ranks', guildSchema);