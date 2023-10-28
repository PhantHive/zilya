import { SlashCommand, SubCommand } from '../../../../../structures/SlashCommand';
import { EmbedBuilder } from 'discord.js';
import { tenorApiSearcher } from './searcher';

export const objectionSubCommand = new SubCommand({
    name: 'objection',
    description: 'Object someone',
    run: async ({ interaction }) => {
        // use tenor api to get a random gif of anime hug
        let search_term = 'objection';
        await tenorApiSearcher(search_term)
            .then((objection: string) => {
                // send the embed
                const embed = new EmbedBuilder()
                    .setColor('#00ff9d')
                    .setTitle(`${interaction.user.username} Objected!`)
                    .setImage(objection)
                    .setTimestamp();

                interaction.reply({ embeds: [embed] });
            })
            .catch((err: string) => {
                console.log(err);
            });
    },
});
