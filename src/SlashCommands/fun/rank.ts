import type { CanvasRenderingContext2D } from 'canvas';
import { createCanvas } from 'canvas';
import RankModel from '../../assets/utils/models/Rank';
import { SlashCommand } from '../../structures/SlashCommand';
import type { IRankDocument } from '../../typings/MongoTypes';
import type { ExtendedInteraction } from '../../typings/SlashCommand';
import { DrawRankCard } from './rank/drawer/drawCard';

const rankCommand = new SlashCommand({
	name: 'rank',
	description: 'Display the rank card',
	options: [],
	run: async ({ interaction }) => {
		if (!interaction.guild) {
			return interaction.reply('This command can only be used in a server.');
		}

		await interaction.deferReply();

		// creating context
		const canvas = createCanvas(670, 270);
		// make canvas transparent
		const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

		let data = await RankModel.findOne<IRankDocument>({
			serverId: `${interaction.guild.id}`,
			userId: `${interaction.user.id}`,
		});

		try {
			if (!data) {
				// check number of doc in db to set rank
				const nbMembers: number = await RankModel.countDocuments({
					serverId: `${interaction.guild.id}`,
				});

				data = await RankModel.create({
					serverId: `${interaction.guild.id}`,
					userId: `${interaction.user.id}`,
					xpMsg: 0,
					levelMsg: 1,
					rankMsg: nbMembers + 1,
					xpVocal: 0,
					levelVocal: 1,
					rankVocal: nbMembers + 1,
				});

				const card = new DrawRankCard(ctx, canvas, data, interaction as ExtendedInteraction);
				const cardBuffer = await card.drawCard();
				return await interaction.editReply({ files: [cardBuffer] });
			} else {
				const card = new DrawRankCard(ctx, canvas, data, interaction as ExtendedInteraction);
				const cardBuffer = await card.drawCard();
				return await interaction.editReply({ files: [cardBuffer] });
			}
		} catch (error) {
			console.error(error);
			return interaction.editReply({
				content: 'Error trying to draw rank card.'
			});
		}

		
	},
});

export default rankCommand;
