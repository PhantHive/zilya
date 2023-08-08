import { SlashCommand } from '../../structures/SlashCommand';

export default new SlashCommand({
    name: 'ping',
    description: 'Pong!',
    run: async ({ interaction }) => {
        await interaction.reply('Pong!');
    },
});
