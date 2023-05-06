"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlashCommand_1 = require("../../../../structures/SlashCommand");
const sqlPhearion_1 = require("../../src/sqlPhearion");
const discord_js_1 = require("discord.js");
exports.default = new SlashCommand_1.SlashCommand({
    name: 'money',
    'options': [
        {
            "name": "user",
            "description": "PSEUDO minecraft",
            "type": 3,
            "required": true
        }
    ],
    description: 'Argent',
    run: async ({ interaction }) => {
        const user = interaction.options.get('user').value;
        if (!user)
            return interaction.reply('User not found');
        console.log(user);
        const sql = await new sqlPhearion_1.sqlPhearion(interaction);
        // get bank infos
        await sql.getBankInfos(user)
            .then((res) => {
            const date = new Date(parseInt(res["last_seen"]));
            const money = new Intl.NumberFormat('fr-FR').format(res["money"]);
            const embed = new discord_js_1.EmbedBuilder()
                .setColor('#fffb00')
                .setAuthor({ name: `Requested by ${interaction.user.username}`, iconURL: interaction.user.avatarURL() })
                .setTitle('PheaUserMoney')
                .addFields({ name: '|Account Name|   ', value: `**${user}**`, inline: true }, { name: '|Money <a:stevedance:879145932451639306>|   ', value: ` **${money}** `, inline: true }, { name: '|Last update <a:minecraftclock:879146014232170506>|', value: ` ${date.toLocaleString()} `, inline: true })
                .setTimestamp()
                .setThumbnail(interaction.client.user.displayAvatarURL());
            return interaction.reply({ embeds: [embed] });
        })
            .catch(() => {
            interaction.reply({ content: `L'utilisateur Casper #${user} n'existe pas.`, ephemeral: true });
        });
    }
});
