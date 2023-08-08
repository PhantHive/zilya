"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const welcomeSchema = new mongoose_1.Schema({
    serverId: String,
    channelId: String,
    theme: Number,
    color: String,
    isEdit: Boolean
});
const WelcomeModel = mongoose_1.default
    .connection
    .useDb('welcome')
    .model('welcomes', welcomeSchema);
exports.default = WelcomeModel;
