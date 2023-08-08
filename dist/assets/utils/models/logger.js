"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const loggerSchema = new mongoose_1.Schema({
    serverId: String,
    notifType: String,
    logChannel: String,
    color: String
});
const LoggerModel = mongoose_1.default
    .connection
    .useDb('logger')
    .model('logs', loggerSchema);
exports.default = LoggerModel;
