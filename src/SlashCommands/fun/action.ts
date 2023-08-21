import { ExtendedInteraction } from '../../typings/SlashCommand';

const hug = require('./action/subcommands/actions/hug');
const objection = require('./action/subcommands/actions/objection');
import { SlashCommand } from '../../structures/SlashCommand';

exports.default = new SlashCommand({
    name: 'action',
    description: 'Action commands',
    options: [
        {
            name: 'hug',
            description: 'Hug someone',
            type: 1,
            options: hug.default.options,
        },
        {
            name: 'objection',
            description: 'Objection!',
            type: 1,
            options: objection.default.options,
        },
    ],
    run: async ({ interaction }) => {
        // check which subcommand was used
        if (
            (interaction as ExtendedInteraction).options.getSubcommand() ===
            'hug'
        ) {
            await hug.default.run({ interaction });
        } else if (
            (interaction as ExtendedInteraction).options.getSubcommand() ===
            'objection'
        ) {
            await objection.default.run({ interaction });
        }
    },
});
