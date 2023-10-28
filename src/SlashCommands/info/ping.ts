import { SlashCommand } from '../../structures/SlashCommand';

export const ping = new SlashCommand({
    name: 'ping',
    description: 'Pong!',
    run: async ({ interaction }) => {
        await interaction.reply('Pong!');
    },
});
