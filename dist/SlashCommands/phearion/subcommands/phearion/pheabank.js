"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlashCommand_1 = require("../../../../structures/SlashCommand");
const index_1 = require("../../../../index");
const sqlPhearion_1 = require("../../src/sqlPhearion");
const discord_js_1 = require("discord.js");
const PBK = require("../../../../assets/utils/models/Pheabank");
exports.default = new SlashCommand_1.SlashCommand({
    name: 'pheabank',
    description: 'Vos informations bancaires',
    run: async ({ interaction }) => {
        await interaction.reply({ content: "Processing...", ephemeral: true });
        let data = await PBK.findOne({
            userId: interaction.user.id
        });
        new Promise(async (resolve, reject) => {
            // create sql entry
            const sql = await new sqlPhearion_1.sqlPhearion(interaction);
            if (!data) {
                const randomNb = Math.floor(Math.random() * 9000) + 1000;
                await interaction.editReply({
                    content: `You need to authentify yourself.\n` +
                        `Please write in the minecraft server the following sentence: ***verify bank account ${randomNb}***`
                }).then(() => {
                    const guild = index_1.client.guilds.cache.get('717344084695580672');
                    const channel = guild.channels.cache.get('732984129443987496');
                    const filter = (m) => {
                        return (m.author.id === "732984718378795120" && m["content"].includes(`verify bank account ${randomNb}`));
                    };
                    const collector = channel.createMessageCollector({ filter, time: 60000, max: 5 });
                    collector.on('collect', async (m) => {
                        let message = m["content"];
                        let splitMessage = message.split("»");
                        let splitFirstPart = splitMessage[0].split(" ");
                        let mcName = splitFirstPart[0];
                        console.log("pseudo:", mcName);
                        try {
                            let result = await sql.getBankInfos(mcName);
                            console.log(result);
                            new PBK({
                                userId: interaction.user.id,
                                mcNick: mcName,
                                daily: 0,
                                pheaCoins: result["money"],
                                discoins: 0,
                                properties: []
                            }).save();
                        }
                        catch (e) {
                            reject("Error while getting bank infos from sql");
                        }
                        resolve(`*${interaction.user.tag} discord account has been linked to: ${mcName}'s minecraft account*`);
                    });
                });
            }
            else {
                let diffTime = Date.now() - data.lastDaily;
                if (diffTime >= 8.64 * (10 ** 7)) {
                    data.daily = 0;
                    data.save();
                }
                let result = await sql.getBankInfos(data.mcNick);
                let daily = "✅";
                if (result["money"] !== data.pheaCoins) {
                    data.pheaCoins = result["money"];
                }
                const fPheaCoins = new Intl.NumberFormat('fr-FR').format(data.pheaCoins);
                const fDiscoins = new Intl.NumberFormat('fr-FR').format(data.discoins);
                if (data.daily === 1) {
                    daily = "❌";
                }
                // try data.save() if it doesn't work retry in 2 seconds
                data.save().catch(() => {
                    setTimeout(() => {
                        data.save();
                    }, 2000);
                });
                const embed = new discord_js_1.EmbedBuilder()
                    .setColor('#FEE75C')
                    .setTitle('<a:money:904801914041032796> PheaBank, We are there for YOU! <a:money:904801914041032796>')
                    .addFields({ name: 'Owner ', value: `${data.mcNick}`, inline: false }, { name: 'PheaCoins   ', value: ` ${fPheaCoins} `, inline: true }, { name: 'Discoins   ', value: ` ${fDiscoins} `, inline: true }, { name: 'Properties', value: ` ${data.properties.length} `, inline: true }, { name: 'Daily (availability)   ', value: ` **${daily}** `, inline: false })
                    .setTimestamp()
                    .setThumbnail(interaction.user.displayAvatarURL());
                await interaction.followUp({ embeds: [embed] });
                return resolve("Embed sent");
            }
        })
            .then((response) => {
            if (response !== "Embed sent") {
                interaction.followUp({ content: response, ephemeral: true });
            }
        })
            .catch((err) => {
            interaction.editReply({ content: "Something went wrong, please try again later" });
        });
    }
});
