require('dotenv').config();
import { ExtendedClient } from './structures/Client';

export const client = new ExtendedClient();

// @ts-ignore
client.mongoose = require('./assets/utils/mongoose.js');
// @ts-ignore
client.mongoose.init();

client.start();