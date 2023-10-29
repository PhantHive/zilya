declare global {
	namespace NodeJS {
		interface ProcessEnv {
			BOT_TOKEN: string;
			GUILD_ID: string;
			NODE_ENV: 'debug' | 'dev' | 'prod';
		}
	}
}

export {};
