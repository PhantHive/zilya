"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Logger_1 = tslib_1.__importDefault(require("../assets/utils/models/Logger"));
const Pheabank_1 = tslib_1.__importDefault(require("../assets/utils/models/Pheabank"));
const Rank_1 = tslib_1.__importDefault(require("../assets/utils/models/Rank"));
const Welcome_1 = tslib_1.__importDefault(require("../assets/utils/models/Welcome"));
// Export
exports.default = {
    WelcomeModel: Welcome_1.default,
    LoggerModel: Logger_1.default,
    PheabankModel: Pheabank_1.default,
    RankModel: Rank_1.default
};
