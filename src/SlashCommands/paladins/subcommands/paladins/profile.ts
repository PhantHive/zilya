import { SlashCommand } from '../../../../structures/SlashCommand';
import { ExtendedInteraction } from '../../../../typings/SlashCommand';
import { API } from 'paladins.js';
import { createCanvas } from 'canvas';
import { drawCard, drawStats } from './src/drawProfile';
import { AttachmentBuilder } from 'discord.js';

let pal: any = new API({
    devId: process.env.DEV_ID,
    authKey: process.env.PALADINS,
}); // API loaded and ready to go.

const userCard = async (paladinsProfile) => {
    // creating context
    const canvas = createCanvas(1250, 1500);
    const ctx = canvas.getContext('2d');

    // drawing card
    await drawCard(ctx, canvas, paladinsProfile);
    // drawing stats
    await drawStats(ctx, canvas, paladinsProfile);

    return new AttachmentBuilder(canvas.toBuffer(), {
        name: 'paladins_profile.png',
    });
};

exports.default = new SlashCommand({
    name: 'profile',
    description: 'Get user profile',
    options: [
        {
            name: 'nickname',
            description: 'Nickname of the player',
            type: 3,
            required: true,
        },
    ],
    run: async ({ interaction }) => {
        const pseudo = (interaction as ExtendedInteraction).options.get(
            'nickname'
        ).value as string;

        await interaction.deferReply();

        let paladinsProfile = {
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
        } catch (e) {
            return await interaction.editReply({
                content: `User not found.`,
            });
        }

        if (res === undefined) {
            return interaction.editReply(
                'Impossible to get data at the moment.'
            );
        } else {
            paladinsProfile.userAvatar = res['AvatarURL'];
            paladinsProfile.hoursPlayed = res['HoursPlayed'];
            paladinsProfile.level = res['Level'];
            paladinsProfile.platform = res['Platform'];
            paladinsProfile.name = res['Name'];
            paladinsProfile.wins = res['Wins'];
            paladinsProfile.losses = res['Losses'];
            paladinsProfile.title = res['Title'];
            paladinsProfile.region = res['Region'];
            paladinsProfile.playerId = res['ActivePlayerId'];
        }

        try {
            res = await pal.getPlayerChampionRanks(
                Number(paladinsProfile.playerId)
            );
        } catch (e) {
            return interaction.editReply({
                content: `Couldn't get champion stats.`,
            });
        }
        paladinsProfile.mostPlayedChamp = res[0]['champion'];

        let champions;
        try {
            champions = await pal.getChampions();
        } catch (e) {
            return interaction.editReply({
                content: 'Impossible to get data at the moment.',
            });
        }

        champions.forEach((champ) => {
            if (champ['Name'] === paladinsProfile.mostPlayedChamp) {
                paladinsProfile.champAvatar = champ['ChampionIcon_URL'];
            }
        });

        let attachment = await userCard(paladinsProfile);
        await interaction.editReply({ files: [attachment] });
    },
});
