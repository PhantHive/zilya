import { client } from '../../index';
import { Event } from '../../structures/Event';
import { ExtendedInteraction, ExtendedSelectMenuInteraction } from '../../typings/SlashCommand';
import {ButtonStyle, ChannelType, CommandInteractionOptionResolver} from "discord.js";
import {setTimeout as wait} from "node:timers/promises";
const { customThemeWelcome, customColorWelcome, selectChannelId} = require("../../SlashCommands/global/src/welcome/custom");
const WDB = require("../../utils/models/Welcomes.js");
const themes = require("../../assets/data/theme.json");

const isChannelValid = async (channel, configName) => new Promise((resolve, reject) => {

    const id = Number(channel);
    if (Number.isInteger(id) && id !== 0 ) {
        resolve(`Thank you! I will setup ${configName} message in this channel.`);
    }
    else {
        reject(`Sorry, I can't setup the ${configName} message in this channel. It is probably not a valid channel.`);
    }

})

const customNextStep = async (client, interaction, data) => {

    if (data.theme !== -1 && data.color !== "#000000") {
        await interaction.editReply({ content: `Your welcome message is fully setup! Congrats my boy.` +
                `\n**Channel**: <#${data.channel_id}>\n**Theme**: ${themes[data.theme]["name"]}\n**Color**: ${data.color}`, components: []})
    }
    else if (data.theme === -1) {
        await customThemeWelcome(client, interaction);
    }
    else {
        await customColorWelcome(client, interaction);
    }
}

// start setup for Welcome and Rules
const startWelcomeSetup = async (client, interaction, data) => {

    if (interaction.values[0] === "manually") {
        await interaction.update({ content: "Please write the channel you want me to send welcome message in. (Either you can tag the channel #channel or give me the ID)", components: [] })

        const filter = i => i.member.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({ filter, time: 30000 });

        collector.on("collect", async msg => {
            let channel;
            if (msg.content.startsWith("<#")) {
                channel = msg.content.match(/\d+/g)
            }
            else {
                channel = msg.content;
            }
            await isChannelValid(channel, "welcome")
                .then(async res => {
                    await interaction.editReply({ content: res });
                    collector.stop();
                    data.channel_id = `${channel}`;
                    data.save();
                    setTimeout(() => msg.delete().catch(() => {}), 5000);
                    await wait(1000);
                    await customNextStep(client, interaction, data); // checking where to go next

                })
                .catch(err => console.log(err));

        })
    }
    else {
        await isChannelValid(interaction.values[0], "welcome")
            .then(async res => {
                await interaction.editReply({ content: res, components: [] })
                    .catch(async () => {
                        await interaction.update({ content: res, components: [] })
                    })
                data.channel_id = `${interaction.values[0]}`;
                data.save();
                await wait(2000);
                await customNextStep(client, interaction, data); // checking where to go next

            })
            .catch(err => console.log(err));

    }
    data.save();

}

const isRoleValid = async (client, interaction, role_id) => new Promise((resolve, reject) => {

    // check if role is valid and in the guild where the interaction was sent;
    const roleObj = client.guilds.cache.get(interaction.guild.id).roles.cache.get(role_id)
    // get bot member object;
    const botMember = client.guilds.cache.get(interaction.guild.id).members.cache.get(client.user.id);
    // check if role is not bot role

    // get all bots names in the guild
    let botNames = [];
    client.guilds.cache.get(interaction.guild.id).members.cache.forEach(member => {
        if (member.user.bot) {
            botNames.push(member.user.username);
        }
    })
    // check if role is not bot role
    try {
        if (botNames.includes(roleObj.name)) {
            reject(`You can't use a bot role as a verification role.`);
        }
    }
    catch (err) {}


    if (roleObj.position > botMember.roles.highest.position && roleObj.id === botMember.roles.highest.id) {
        reject(`Cannot assign the role to the member because the role is above the bot or because it is a bot role.`);
    }

    if (roleObj) {
        resolve(`Thank you! I will give this role to new members.`);
    }
    else {
        reject(`Sorry, I can't give this role to new members. It is probably not a valid role or the role is above mines. Check the hierarchy of the roles.`);
    }
})

const chooseConfigWelcome = async (client, interaction, choice, isEdit) => {
    // 1 => channel id
    // 2 => theme
    // 3 => color
    WDB.findOne({
            server_id: interaction.guild.id
        },
        async (err, data) => {
            if (err) {
                await interaction.update({ content: "Sorry, A problem occured with the database. Please try again later.", components: [] });
                return console.log(err);
            }

            if (isEdit) {
                if (choice === 1) {
                    let channels = interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildText).map(c => {
                        return {
                            label: `${c.name}`,
                            value: `${c.id}`
                        }
                    });

                    if (channels.length >= 25) {
                        channels.splice(24, channels.length - 23)
                    }

                    data.channel_id = "0";
                    data.save();
                    await selectChannelId(client, interaction, channels);
                }
                else if (choice === 2) {
                    await customThemeWelcome(client, interaction);
                }
                else if (choice === 3) {
                    await customColorWelcome(client, interaction);
                }
            }
            else {
                if (choice === 1) {
                    if (!data) {
                        await new WDB({
                            server_id: `${interaction.guild.id}`,
                            channel_id: "0",
                            theme: -1,
                            color: "#000000"
                        }).save();

                        WDB.findOne({
                                server_id: interaction.guild.id
                            },
                            async (err, data) => {
                                if (err) {
                                    await interaction.update({ content: "Sorry, A problem occured with the database. Please try again later." });
                                    return console.log(err);
                                }
                                await interaction.update({ content: "Wait a sec please...", components: [] });
                                await wait(1000);
                                await startWelcomeSetup(client, interaction, data);
                            }
                        )

                    }
                    else if (data.channel_id !== "0") {
                        await interaction.update({ content: "The channel id has already been set. If you want to change it use `welcome edit`." +
                                "\nGoing to the next step."});
                        await wait(2500);
                        await customThemeWelcome(client, interaction);
                    }
                    else {
                        await startWelcomeSetup(client, interaction, data);
                    }
                }
                else {
                    if (!data) {
                        await interaction.update({ content: "Sorry, A problem occured with the database. Please try again later.", components: [] });
                    }
                    if (choice === 2) {
                        if (data.theme !== -1 && !data.isEdit) {
                            await interaction.update({ content: "The theme has already been set. If you want to change it use `welcome edit`." +
                                    "\nGoing to the next step.", components: []});
                            await wait(2500);
                            await customNextStep(client, interaction, data); // checking where to go next
                        }
                        else {
                            data.theme = parseInt(interaction.values[0]);
                            data.isEdit = false;
                            await data.save();
                            let theme;
                            try {
                                theme = themes[parseInt(interaction.values[0])]["name"]
                            }
                            catch (e) {
                                return interaction.update({ content: "A problem occured with the selected theme. Please try again later.", components: [] });

                            }
                            await interaction.update({ content: `You have choosen ${theme} as your welcome message theme.`, components: [] })

                            await wait(2000);
                            await customNextStep(client, interaction, data); // checking where to go next
                        }

                    }
                    else {
                        if (data.color !== "#000000" && !data.isEdit) {
                            await interaction.update({ content: "Seems like everything have already been set. If you want to change it use `welcome edit`.", components: [] })
                                .catch(async () => {
                                    await interaction.editReply({ content: "Seems like everything have already been set. If you want to change it use `welcome edit`.", components: [] })
                                })
                            await wait(2500);
                            await customColorWelcome(client, interaction);
                        }
                        else {
                            data.color = interaction.values[0];
                            data.isEdit = false;
                            await data.save();
                            await interaction.update({ content: `Your welcome message is fully setup! Congrats my boy.` +
                                    `\n**Channel**: <#${data.channel_id}>\n**Theme**: ${themes[data.theme]["name"]}\n**Color**: ${data.color}`, components: [] })
                                .catch(async () => {
                                    await interaction.editReply({ content: `Your welcome message is fully setup! Congrats my boy.` +
                                            `\n**Channel**: <#${data.channel_id}>\n**Theme**: ${themes[data.theme]["name"]}\n**Color**: ${data.color}`, components: [] });
                                })
                        }

                    }
                }
            }
        }
    )
}

export default new Event('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    await command.run({
        args: interaction.options as CommandInteractionOptionResolver,
        client,
        interaction: interaction as (ExtendedInteraction | ExtendedSelectMenuInteraction)
    });

    if (interaction.isSelectMenu()) {

        // ================
        // WELCOME SYSTEM
        // ================

        // welcome message edit
        // if ((interaction as ExtendedSelectMenuInteraction).customId === "edit_welcome") {
        //     if ((interaction as ExtendedSelectMenuInteraction).values[0] === "edit_channel_id") {
        //         await chooseConfigWelcome(client, interaction, 1, true);
        //     }
        //     else if ((interaction as ExtendedSelectMenuInteraction).values[0] === "edit_theme") {
        //         await chooseConfigWelcome(client, interaction, 2, true);
        //     }
        //     else if ((interaction as ExtendedSelectMenuInteraction).values[0] === "edit_color") {
        //         await chooseConfigWelcome(client, interaction, 3, true);
        //     }
        // }

        // welcome message

        if ((interaction as ExtendedSelectMenuInteraction).customId === "channel_id") {
            await chooseConfigWelcome(client, interaction, 1, false);
        }
        if ((interaction as ExtendedSelectMenuInteraction).customId === "theme") {
            //await interaction.editReply({ content: `You have choosen ${interaction.values[0]} as your welcome message theme.` });
            await chooseConfigWelcome(client, interaction, 2, false);
        }
        if ((interaction as ExtendedSelectMenuInteraction).customId === "color") {
            await chooseConfigWelcome(client, interaction, 3, false);
            //await interaction.editReply({ content: "Your welcome message is fully setup! Congrats my boy" });
        }


    }
});
