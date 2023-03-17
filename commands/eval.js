const { SlashCommandBuilder } = require("@discordjs/builders")
require("dotenv").config()
// const ch = require('chalk')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("eval")
        .setDescription("Bot owner only command")
        .addStringOption((query) => query.setName("eval").setDescription("Evals the query").setRequired(true)),
    async execute(interaction) {
        if (interaction.user.id != process.env.OWNER) {
            return interaction.reply({
                content: "You do not have access to this command!",
                ephemeral: true,
            })
        }

        const query = interaction.options._hoistedOptions[0].value

        await interaction.reply({
            content: `${eval(query)}`,
            ephemeral: true,
        })
    },
}
