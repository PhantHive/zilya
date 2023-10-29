import { SlashCommand } from '../../structures/SlashCommand';

const ping = new SlashCommand({
	name: 'ping',
	description: 'Pong!',
	run: async ({ interaction }) => {
		try {
			console.log('ping');
			await interaction.reply('Pong!');
		} catch (error) {
			console.error('Error executing ping command', error);
		}
	},
});

export default ping;
