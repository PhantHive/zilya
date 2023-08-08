"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const rankSchema = new mongoose_1.Schema({
    serverId: String,
    userId: String,
    xpMsg: Number,
    levelMsg: Number,
    rankMsg: Number,
    xpVocal: Number,
    levelVocal: Number,
    rankVocal: Number
});
const RankModel = mongoose_1.default
    .connection
    .useDb('rank')
    .model('ranks', rankSchema);
exports.default = RankModel;
