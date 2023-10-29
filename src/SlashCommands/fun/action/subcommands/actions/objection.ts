import { EmbedBuilder } from 'discord.js';
import { SubCommand } from '../../../../../structures/SlashCommand';
import { tenorApiSearcher } from './searcher';

export const objectionSubCommand = new SubCommand({
	name: 'objection',
	description: 'Object someone',
	run: async ({ interaction }) => {
		// use tenor api to get a random gif of anime hug
		const search_term = 'objection';
		const objectionGif = await tenorApiSearcher(search_term);
		if (!objectionGif) return interaction.reply('Error getting gif');
		// send the embed
		const embed = new EmbedBuilder()
			.setColor('#00ff9d')
			.setTitle(`${interaction.user.username} Objected!`)
			.setImage(objectionGif)
			.setTimestamp();
		return interaction.reply({ embeds: [embed] });
	},
});
