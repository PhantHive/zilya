import { SlashCommand } from '../../structures/SlashCommand';
import { ExtendedInteraction } from '../../typings/SlashCommand';

const profile = require('./subcommands/paladins/profile');

exports.default = new SlashCommand({
    name: 'paladins',
    description: 'Paladins infos (PC players only).',
    options: [
        {
            name: 'profile',
            description: 'Get user profile',
            type: 1,
            options: profile.default.options,
        },
    ],
    run: async ({ interaction }) => {
        // check which subcommand was used
        if (
            (interaction as ExtendedInteraction).options.getSubcommand() ===
            'profile'
        ) {
            await profile.default.run({ interaction });
        }
    },
});
