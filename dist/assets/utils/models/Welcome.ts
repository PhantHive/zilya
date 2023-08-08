import mongoose, { Schema } from 'mongoose';

const welcomeSchema = new Schema({

    serverId: String,
    channelId: String,
    theme: Number, //image category
    color: String, //color,
    isEdit: Boolean

});

const WelcomeModel = mongoose
    .connection
    .useDb('welcome')
    .model('welcomes', welcomeSchema);

export default WelcomeModel;