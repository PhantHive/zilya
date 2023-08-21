import { SlashCommand } from '../../../../../structures/SlashCommand';
import {EmbedBuilder, User} from 'discord.js';
import { ExtendedInteraction } from '../../../../../typings/SlashCommand';
import { tenorApiSearcher } from './searcher';

exports.default = new SlashCommand({
    name: 'hug',
    description: 'Hug someone',
    options: [
        {
            name: 'user',
            description: 'User to hug',
            type: 6,
            required: true,
        },
    ],
    run: async ({ interaction }) => {
        const user = (interaction as ExtendedInteraction).options.getUser(
            'user'
        );
        let huggedOne: User | string;

        if (user.id === interaction.user.id) {
            huggedOne = 'him/herself';
        } else if (user.bot) {
            huggedOne = 'a beautiful BOT';
        } else {
            huggedOne = user;
        }

        // use tenor api to get a random gif of anime hug
        let search_term = 'anime hug';
        await tenorApiSearcher(search_term)
            .then((hug: string) => {
                // send the embed
                const embed = new EmbedBuilder()
                    .setColor('#00ff9d')
                    .setTitle(
                        `♥ ${interaction.user.username} hugged ${huggedOne} ♥`
                    )
                    .setImage(hug)
                    .setTimestamp();

                interaction.reply({ embeds: [embed] });
            })
            .catch((err: string) => {
                console.log(err);
            });
    },
});
