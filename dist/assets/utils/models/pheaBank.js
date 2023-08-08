"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const phearionSchema = new mongoose_1.Schema({
    userId: String,
    mcNick: String,
    daily: Number,
    lastDaily: Number,
    pheaCoins: Number,
    discoins: Number,
    properties: Array
});
const PhearionModel = mongoose_1.default
    .connection
    .useDb('phearion')
    .model('banks', phearionSchema);
exports.default = PhearionModel;
