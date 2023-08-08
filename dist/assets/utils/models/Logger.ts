import mongoose, {Schema} from 'mongoose';

const loggerSchema = new Schema({

    serverId: String,
    notifType: String,
    logChannel: String,
    color: String

});

const LoggerModel = mongoose
    .connection
    .useDb('logger')
    .model('logs', loggerSchema);

export default LoggerModel;