import {ActionRow, ActionRowBuilder, StringSelectMenuBuilder} from "discord.js";


const editOptions = async (interaction) => {

    let actionRow: ActionRowBuilder = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("edit_welcome")
                .setPlaceholder("Choose an option")
                .addOptions(
                    {
                        label: "Edit channel id",
                        emoji: "📝",
                        value: "edit_channel_id",
                    },
                    {
                        label: "Edit color",
                        emoji: "🎨",
                        value: "edit_color",
                    },
                    {
                        label: "Edit theme",
                        emoji: "🦄",
                        value: "edit_theme",
                    }
                )
        )

    await interaction.reply({ content: "What do you wish to edit?", components: [actionRow] })
        .catch(() => {
            interaction.editReply({ content: "What do you wish to edit?", components: [actionRow] })
        })
}


export {
    editOptions
}
