import { createCanvas } from 'canvas';
import type { BooleanCache, CacheType, Message } from 'discord.js';
import { AttachmentBuilder } from 'discord.js';
import { API } from 'paladins.js';
import { SubCommand } from '../../../../structures/SlashCommand';
import type { PaladinsProfile } from '../../../../typings/PaladinsTypes';
import type { ExtendedInteraction } from '../../../../typings/SlashCommand';
import { drawCard, drawStats } from './src/drawProfile';

const pal: any = new API({
	devId: process.env.DEV_ID,
	authKey: process.env.PALADINS,
}); // API loaded and ready to go.

const userCard = async (paladinsProfile: PaladinsProfile) => {
	// creating context
	const canvas = createCanvas(1_250, 1_500);
	const ctx = canvas.getContext('2d');

	// drawing card
	await drawCard(ctx, canvas, paladinsProfile);
	// drawing stats
	await drawStats(ctx, canvas, paladinsProfile);

	return new AttachmentBuilder(canvas.toBuffer(), {
		name: 'paladins_profile.png',
	});
};

export const profileSubCommand = new SubCommand({
	name: 'profile',
	description: 'Get user profile',
	run: async ({ interaction }): Promise<Message<BooleanCache<CacheType>>> => {
		await interaction.deferReply();

		if (!(interaction as ExtendedInteraction).options.getString('nickname')) {
			return interaction.editReply({
				content: `You need to provide a nickname.`,
			});
		}

		const pseudo = (interaction as ExtendedInteraction).options.getString('nickname');

		const paladinsProfile: PaladinsProfile = {
			userAvatar: '',
			hoursPlayed: '',
			level: '',
			platform: '',
			name: '',
			wins: '',
			losses: '',
			title: '',
			region: '',
			playerId: '',
			mostPlayedChamp: '',
			champAvatar: '',
		};

		let res;
		try {
			res = await pal.getPlayer(pseudo);
		} catch {
			return await interaction.editReply({
				content: `User not found.`,
			});
		}

		if (res === undefined) {
			return interaction.editReply('Impossible to get data at the moment.');
		} else {
			paladinsProfile.userAvatar = res.AvatarURL;
			paladinsProfile.hoursPlayed = res.HoursPlayed;
			paladinsProfile.level = res.Level;
			paladinsProfile.platform = res.Platform;
			paladinsProfile.name = res.Name;
			paladinsProfile.wins = res.Wins;
			paladinsProfile.losses = res.Losses;
			paladinsProfile.title = res.Title;
			paladinsProfile.region = res.Region;
			paladinsProfile.playerId = res.ActivePlayerId;
		}

		try {
			res = await pal.getPlayerChampionRanks(Number(paladinsProfile.playerId));
		} catch {
			return interaction.editReply({
				content: `Couldn't get champion stats.`,
			});
		}

		paladinsProfile.mostPlayedChamp = res[0].champion;

		let champions;
		try {
			champions = await pal.getChampions();
		} catch {
			return interaction.editReply({
				content: 'Impossible to get data at the moment.',
			});
		}

		for (const champ of champions) {
			if (champ.Name === paladinsProfile.mostPlayedChamp) {
				paladinsProfile.champAvatar = champ.ChampionIcon_URL;
			}
		}

		const attachment = await userCard(paladinsProfile);
		return interaction.editReply({ files: [attachment] });
	},
});
