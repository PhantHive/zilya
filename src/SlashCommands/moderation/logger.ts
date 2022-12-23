import {SlashCommand} from "../../structures/SlashCommand";
const LG = require("../../assets/models/logger.js");

exports.default = new SlashCommand({
    name: 'logger',
    description: 'Logger for the server',
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

        let channelId = interaction.options.get('channel_id').channel.id;
        let notifType = interaction.options.get('notif').value as string;
        let color;
        try {
            color = interaction.options.get('color').value as string;
            color = color.toUpperCase();
        }
        catch (e) {
            color = "#fee75c";
        }


        // check if the channel is type text
        if (interaction.options.get('channel_id').channel.type !== 0) {
            await interaction.reply({content: "Please choose a text channel. Cannot log into a voice channel.", ephemeral: true});
            return;
        }

        const serverName = interaction.guild.name;
        const serverId = interaction.guild.id;

        LG.findOne({
                serverId: interaction.guild.id
            },
            async (err, data) => new Promise(async (resolve) => {
                    if (!data) {
                        await new LG({
                            serverId: serverId,
                            notifType: notifType,
                            logChannel: channelId,
                            color: color

                        }).save()

                        return resolve(`**${serverName}** with id: **${serverId}** has set notif to: **${notifType}** at **${channelId}**`);

                    }

                    return resolve('This server already has a log channel.');

                })
                .then((result: string) => interaction.reply({content: result}))

        )
    }
})