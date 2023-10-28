import { SlashCommand } from '../../../../structures/SlashCommand';
const PBK = require('../../../../assets/utils/models/Pheabank');
import { sqlPhearion } from '../../src/sqlPhearion';

exports.default = new SlashCommand({
    name: 'daily',
    description: 'Gagnez 20 Discoins par jour!',
    run: async ({ interaction }) => {
        let data = await PBK.findOne({
            userId: interaction.user.id,
        });

        new Promise(async (resolve, reject) => {
            if (!data) {
                reject(
                    'You may want to link your discord account with your phearion account.\n*Please use: /pheabank*',
                );
            } else {
                if (data.daily === 0) {
                    data.lastDaily = Date.now();
                    data.daily = 1;
                    data.discoins += 20;
                    data.save();
                    resolve(
                        '**20 Discoins** added to your account! *(/pheabank)*',
                    );
                } else {
                    let timeNow = Date.now();
                    let diffTime: number = timeNow - data.lastDaily;

                    if (diffTime >= 8.64 * 10 ** 7) {
                        data.discoins += 20;
                        data.lastDaily = timeNow;
                        data.save();
                        resolve(
                            '**20 Discoins** added to your account! *(/pheabank)*',
                        );
                    } else {
                        let timeLeft = 8.64 * 10 ** 7 - diffTime;
                        let minutes: string | number = Math.floor(
                            (timeLeft / (1000 * 60)) % 60,
                        );
                        let hours: string | number = Math.floor(
                            (timeLeft / (1000 * 60 * 60)) % 24,
                        );

                        hours = hours < 10 ? '0' + hours : hours;
                        minutes = minutes < 10 ? '0' + minutes : minutes;

                        resolve(
                            `You cannot use /daily now! **${hours} hours ${minutes} min left**.`,
                        );
                    }
                }
            }
        })
            .then((result: string) =>
                interaction.reply({ content: result, ephemeral: true }),
            )
            .catch(() =>
                interaction.reply({ content: 'Something went wrong' }),
            );
    },
});
