const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({

    serverId: String,
    notifType: String,
    logChannel: String,
    color: String

});

const myDB = mongoose.connection.useDb('logger');
module.exports = myDB.model('logs', guildSchema);