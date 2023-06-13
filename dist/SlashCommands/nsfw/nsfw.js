"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlashCommand_1 = require("../../structures/SlashCommand");
const nekosapi_1 = require("nekosapi");
const nekos = new nekosapi_1.NekosAPI();
async function getNSFWContent(request) {
    // use nekobot.xyz api to get a random nsfw image
    const response = await fetch(`https://nekobot.xyz/api/image?type=${request}`);
    const json = await response.json();
    console.log(json);
    if (json.success === true) {
        return json.message;
    }
    return null;
}
exports.default = new SlashCommand_1.SlashCommand({
    name: 'neko',
    description: 'nekos',
    nsfw: true,
    options: [
        {
            name: 'sfw',
            description: 'SFW neko',
            type: 3,
            required: true,
        },
    ],
    run: async ({ interaction }) => {
        await interaction.deferReply();
        const request = interaction.options.getString('sfw');
        const url = await getNSFWContent(request);
        if (url === null) {
            await interaction.editReply('No neko content found.');
        }
        else {
            await interaction.editReply({ content: url });
        }
    },
});
