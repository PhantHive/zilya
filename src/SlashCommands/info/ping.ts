import { SlashCommand } from '../../structures/SlashCommand';

const ping = new SlashCommand({
    name: 'ping',
    description: 'Pong!',
    run: async ({ interaction }) => {
        await interaction.reply('Pong!');
    },
});

export default ping;
