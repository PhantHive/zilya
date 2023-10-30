import { config } from 'dotenv';
import { dbConnect } from './assets/utils/mongoose';
import { ExtendedClient } from './structures/Client';

config({ path: './.env' });

export const client = new ExtendedClient();

const main = async (): Promise<boolean> => {
	const connectToDb: Promise<void> = dbConnect.init();
	const clientStart: Promise<void> = client.start();

	await Promise.all([connectToDb, clientStart]);
	console.log('Connected to database and logged in!');

	return true;
};

const startBot = await main();
if (startBot) {
	console.log('Bot started!');
}
