import type { User } from 'discord.js';
import { EmbedBuilder } from 'discord.js';
import { SubCommand } from '../../../../../structures/SlashCommand';
import type { ExtendedInteraction } from '../../../../../typings/SlashCommand';
import { tenorApiSearcher } from './searcher';

export const hugSubCommand = new SubCommand({
	name: 'hug',
	description: 'Hug someone',
	run: async ({ interaction }) => {
		const user = (interaction as ExtendedInteraction).options.getUser('user');
		let huggedOne: User | string;
		if (!user) return interaction.reply('User not found');
		if (user.id === interaction.user.id) {
			huggedOne = 'him/herself';
		} else if (user.bot) {
			huggedOne = 'a beautiful BOT';
		} else {
			huggedOne = user;
		}

		// use tenor api to get a random gif of anime hug
		const search_term = 'anime hug';
		const hugGif = await tenorApiSearcher(search_term);
		if (!hugGif) return interaction.reply('Could not find a gif');
		const embed = new EmbedBuilder()
			.setColor('#00ff9d')
			.setTitle(`♥ ${interaction.user.username} hugged ${huggedOne} ♥`)
			.setImage(hugGif)
			.setTimestamp();
		return interaction.reply({ embeds: [embed] });
	},
});
