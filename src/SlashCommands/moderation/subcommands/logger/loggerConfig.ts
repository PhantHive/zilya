import {SlashCommand} from "../../../../structures/SlashCommand";
import {EmbedBuilder} from "discord.js";
const LG = require("../../../../assets/utils/models/logger.js");
import colors from "../../../../assets/data/colors.json";
import {ExtendedInteraction} from "../../../../typings/SlashCommand";

exports.default = new SlashCommand({
    name: 'configure',
    description: 'Configure logger for the server',
    options: [
        {
            "name": "channel_id",
            "description": "channel id",
            "type": 7,
            "required": true
        },
        {
            "name": "notif",
            "description": "which notification you want",
            "type": 3,
            "choices": [
                {
                    "name": "all",
                    "value": "all"
                },
                {
                    "name": "no voice logs",
                    "value": "no_voice_logs"
                },
                {
                    "name": "voice logs",
                    "value": "only_voice_logs"
                }
            ],
            "required": true
        },
        {
            "name": "color",
            "description": "Choose a color. By default: Yellow",
            "type": 3,
            "choices": [
                {
                    "name": "Red",
                    "value": "red"
                },
                {
                    "name": "Blue",
                    "value": "blue"
                },
                {
                    "name": "Aqua",
                    "value": "aqua"
                },
                {
                    "name": "Green",
                    "value": "green"
                },
                {
                    "name": "Pink",
                    "value": "luminous_vivid_pink"
                }
            ]

        }
    ],
    userPermissions: ['Administrator'],
    run: async ({interaction}) => {
        let channelId = (interaction as ExtendedInteraction).options.get('channel_id').channel.id;
        let notifType = (interaction as ExtendedInteraction).options.get('notif').value as string;
        let color;
        try {
            color = (interaction as ExtendedInteraction).options.get('color').value as string;
            color = color.toUpperCase();
        }
        catch (e) {
            color = "#fee75c";
        }


        // check if the channel is type text
        if ((interaction as ExtendedInteraction).options.get('channel_id').channel.type !== 0) {
            await interaction.reply({content: "Please choose a text channel. Cannot log into a voice channel.", ephemeral: true});
            return;
        }

        const serverName = interaction.guild.name;
        const serverId = interaction.guild.id;

        let data = await LG.findOne({
                serverId: interaction.guild.id
            });

        new Promise(async (resolve) => {
                let embed: EmbedBuilder;
                if (!data) {
                    await new LG({
                        serverId: serverId,
                        notifType: notifType,
                        logChannel: channelId,
                        color: color

                    }).save()

                    // create EmbedBuilder with the color, a title "Server ID: Server Name" and a description "Logger has been configured."
                    // "and a description with channel id and notif type"
                    // send the embed

                    embed = new EmbedBuilder()
                        .setColor(colors[color.toLowerCase()])
                        .setTitle(`${serverId}: ${serverName}`)
                        .setDescription(`Logger has been configured.`)
                        .addFields([
                            {
                                name: "Channel ID",
                                value: channelId,
                                inline: true
                            },
                            {
                                name: "Notification Type",
                                value: notifType,
                                inline: true
                            }
                        ])

                    return resolve(embed);

                }

                embed = new EmbedBuilder()
                    .setColor(colors[data.color.toLowerCase()])
                    .setTitle(`${serverId}: ${serverName}`)
                    .setDescription(`This server already has a log channel. \`/logger remove\` to change it.`)

                return resolve(embed);

        })
        .then((result: EmbedBuilder) => {
            interaction.reply({embeds: [result]})
        })
        .catch((err: Error) => {
            console.log(err);
        })
    }
});