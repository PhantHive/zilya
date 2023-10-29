"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedClient = void 0;
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var discord_js_1 = require("discord.js");
var glob = require("glob");
var ExtendedClient = /** @class */ (function (_super) {
    __extends(ExtendedClient, _super);
    // public static superagent: typeof superagent;
    function ExtendedClient() {
        var _this = _super.call(this, {
            intents: [
                'Guilds',
                'GuildMessages',
                'GuildMembers',
                'GuildMessageReactions',
                'MessageContent',
                'DirectMessages',
                'GuildVoiceStates',
            ],
        }) || this;
        _this.commands = new discord_js_1.Collection();
        return _this;
    }
    ExtendedClient.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.registerModules()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.login(process.env.BOT_TOKEN)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ExtendedClient.prototype.importFiles = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var fileURL, file;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fileURL = (0, node_url_1.pathToFileURL)(filePath);
                        return [4 /*yield*/, Promise.resolve("".concat(fileURL.href)).then(function (s) { return require(s); })];
                    case 1:
                        file = _a.sent();
                        return [2 /*return*/, file === null || file === void 0 ? void 0 : file.default];
                }
            });
        });
    };
    ExtendedClient.prototype.registerCommands = function (_a) {
        var _b, _c;
        var commands = _a.commands, guildId = _a.guildId;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!guildId) return [3 /*break*/, 2];
                        return [4 /*yield*/, ((_b = this.guilds.cache.get(guildId)) === null || _b === void 0 ? void 0 : _b.commands.set(commands))];
                    case 1:
                        _d.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, ((_c = this.application) === null || _c === void 0 ? void 0 : _c.commands.set(commands))];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ExtendedClient.prototype.registerModules = function () {
        return __awaiter(this, void 0, void 0, function () {
            var slashCommands, __filename, __dirname, commandFiles, count, _i, commandFiles_1, filePath, command, error_1, eventFiles, _a, eventFiles_1, filePath, event_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        slashCommands = [];
                        __filename = (0, node_url_1.fileURLToPath)(import.meta.url);
                        __dirname = (0, node_path_1.dirname)(__filename);
                        commandFiles = glob.sync("".concat(__dirname, "/../SlashCommands/*/*{.ts,.js}").replaceAll('\\', '/'));
                        count = 1;
                        _i = 0, commandFiles_1 = commandFiles;
                        _b.label = 1;
                    case 1:
                        if (!(_i < commandFiles_1.length)) return [3 /*break*/, 6];
                        filePath = commandFiles_1[_i];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.importFiles(filePath)];
                    case 3:
                        command = _b.sent();
                        if (!command || !command.name) {
                            console.error("Command not found or invalid command structure in file: ".concat(filePath));
                            return [3 /*break*/, 5];
                        }
                        this.commands.set(command.name, command);
                        slashCommands.push(command);
                        count++;
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _b.sent();
                        console.error("Error loading command from file: ".concat(filePath), error_1);
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6:
                        this.on('ready', function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.registerCommands({
                                            commands: slashCommands,
                                            guildId: '',
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        eventFiles = glob.sync("".concat(__dirname, "/../events/*/*{.ts,.js}").replaceAll('\\', '/'));
                        count = 1;
                        _a = 0, eventFiles_1 = eventFiles;
                        _b.label = 7;
                    case 7:
                        if (!(_a < eventFiles_1.length)) return [3 /*break*/, 10];
                        filePath = eventFiles_1[_a];
                        return [4 /*yield*/, this.importFiles(filePath)];
                    case 8:
                        event_1 = _b.sent();
                        this.on(event_1.event, event_1.run);
                        count++;
                        _b.label = 9;
                    case 9:
                        _a++;
                        return [3 /*break*/, 7];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    return ExtendedClient;
}(discord_js_1.Client));
exports.ExtendedClient = ExtendedClient;
