import {SlashCommand} from "../../../../structures/SlashCommand";
import {
    ActionRowBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder, GuildChannel, GuildTextBasedChannel,
    Interaction, Message, MessageCollector,
    TextChannel
} from "discord.js";
import {ExtendedInteraction} from "../../../../typings/SlashCommand";
import {client} from "../../../../index";
const PBK = require("../../../../assets/utils/models/pheaBank.js");
import {sqlPhearion} from "../../src/sqlPhearion";
import interactionCreate from "../../../../events/guild/interactionCreate";

exports.default = new SlashCommand({
    name: 'phearea',
    description: 'Faites partie des propriétaires de la ville!',
    options: [
        {
            "name": "info",
            "description": "Choisissez une zone à acheter",
            "type": 3,
            "required": true,
            "choices": [
                {
                    "name": "souk level 20-27",
                    "value": "souk19_27-200"
                }
            ]
        }
    ],
    run: async ({interaction}) => {



        const info = (interaction as ExtendedInteraction).options.get("info").value as string;
        let image_name: string = info.split('-')[0];
        let price: number = Number(info.split('-')[1]);

        let image_path = `./src/assets/img/phearion/areas/${image_name}.png`
        const attachment = new AttachmentBuilder(image_path, { name: 'area.png' });
        const sql = await new sqlPhearion((interaction as ExtendedInteraction));

        const areaEmbed = new EmbedBuilder()
            .setColor('#FF52F8')
            .setTitle(image_name.replace(/_/g, ' '))
            .addFields(
                {
                    "name": 'Required:',
                    "value": `${price} Discoins`
                })
            .setImage('attachment://area.png')

        let buyArea;
        let buyFriend;

        let labelBuy = "BUY";
        let canBuy = false;

        let data = await PBK.findOne({
                userId: interaction.user.id
        });


        if (!data) {
            await interaction.followUp("You may want to link your discord account with your phearion account.\n*Please use: /pheabank*");
        } else {

            data.properties.forEach(property => {
                if (property === image_name) {
                    labelBuy = "Ajouter"
                    canBuy = true

                }
            })
            buyArea = new ButtonBuilder()
                .setCustomId('buy_area')
                .setLabel(labelBuy)
                .setStyle(ButtonStyle.Success)
                .setDisabled(canBuy)


            buyFriend = new ButtonBuilder()
                .setCustomId('buy_friend')
                .setLabel('Achète pour un ami!')
                .setStyle(ButtonStyle.Primary)

            let row = new ActionRowBuilder()
                .addComponents(
                    buyArea, buyFriend
                );

            await interaction.reply({embeds: [areaEmbed], files: [attachment], components: [row as any]});

            const filter: any = (i: ExtendedInteraction) => (i.customId === 'buy_area' || i.customId === 'buy_friend') && i.user.id === interaction.user.id;

            const collector = (interaction.channel as TextChannel).createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async (i: ExtendedInteraction) => {

                if (i.customId === "buy_friend") {
                    await i.reply("Tag ton ami sur Discord (Il doit avoir un compte minecraft lié au Discord).")
                        .then(() => {
                            const filter = message => message.author.id === i.user.id;

                            const collector: MessageCollector = (interaction.channel as TextChannel).createMessageCollector({ filter, time: 15000 });

                            collector.on('collect',  async  (m: Message) :  Promise<void> => {

                                let friendId = m.content.split('@')[1].split('>')[0];
                                if (friendId === m.author.id) {
                                    await i.followUp("Tu es qui tu es mais sûrement pas un ami de toi-même.")
                                    return;
                                }
                                if (m.guild.members.cache.has(friendId)) {
                                    PBK.findOne({
                                            userId: friendId
                                        },
                                        async (err, dataFriend) => {
                                            await client.users.fetch(friendId).then(async (user) => {

                                                if (user.bot) return i.followUp("N'essaye pas de nourrir les bots, ils ne sont pas faits pour ça.")

                                                if (!dataFriend) {
                                                    await i.followUp("Ton ami n'a pas lié son compte minecraft!")
                                                    return;
                                                }
                                                else {
                                                    if (data.discoins < price) {
                                                        await i.editReply({content: "**[❌]**: Tu n'as pas assez d'argent pour faire se transfère"});
                                                        return;
                                                    } else {

                                                        data.discoins -= price
                                                        dataFriend.properties.push(image_name)
                                                        data.save()
                                                        dataFriend.save()
                                                        await i.followUp(`<a:stevedance:879145932451639306> ${m.content} just unlocked a new area: ***${image_name}*** !!! \n *(24hours remaining before you can enter your new property)*`)
                                                        return;
                                                    }
                                                }
                                            })

                                        }
                                    )
                                }
                                else {
                                    await i.followUp("Il semblerait que ton ami ne soit pas sur ce serveur.")
                                    return;
                                }
                            })
                        })
                }
                else {
                    if (data.discoins < price) {
                        await i.reply("**[❌]**: You don't have enough money to make this transfer.");
                    } else {

                        await sql.addProperty(data.mcNick, image_name)
                            .then(async () => {
                                data.discoins -= price;
                                data.properties.push(image_name);
                                data.save();

                                if (i.customId === 'buy_area') {

                                    buyArea = new ButtonBuilder()
                                        .setCustomId('buy_area')
                                        .setLabel('Acheté!')
                                        .setDisabled(true)
                                        .setStyle(ButtonStyle.Success)

                                    row = new ActionRowBuilder()
                                        .addComponents(
                                            buyArea, buyFriend
                                        );

                                    await i.update({components: [row]});
                                }
                                await i.editReply({ content: `<a:stevedance:879145932451639306> Tu viens juste de débloquer une nouvelle zone: ***${image_name}*** !!! \n *(Reconnecte toi pour recevoir ton achat.)*` })
                            })
                            .catch(async (err) => {
                                await i.update({content: `**[❌]**: Erreur lors de l'achat de la propriété.`})

                            })
                    }

                }

            });


        }

    }

});