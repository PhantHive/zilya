"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const dbConnect = {
    init: async () => {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false,
            connectTimeoutMS: 20000,
            maxPoolSize: 100,
            family: 4,
        };
        await mongoose_1.default.connect(`mongodb+srv://PhantHive:${process.env.MONGO_DB}@iris.txxhe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, options);
        mongoose_1.default.Promise = global.Promise;
        mongoose_1.default.connection.on('connected', () => {
            console.log('Connected to MongoDB!');
        });
        mongoose_1.default.connection.on('error', error => {
            console.error('MongoDB Connection Error: ', error);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.warn('Disconnected from MongoDB');
        });
    }
};
exports.default = dbConnect;
