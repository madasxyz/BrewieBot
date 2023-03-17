const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const fetch = require("node-fetch")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("8ball")
        .setDescription("Ask the eight ball anything.")
        .addStringOption((term) =>
            term.setName("question").setRequired(true).setDescription("Question to ask the eight ball")
        ),
    async execute(interaction) {
        const theQuestion = interaction.options._hoistedOptions[0].value

        let params = encodeURIComponent(theQuestion)
        let uri = "https://8ball.delegator.com/magic/JSON/" + params
        fetch(uri)
            .then((response) => response.json())
            .then((json) => {
                const embed = new MessageEmbed()
                    // .setTitle(`🎱 8ball`)
                    .addField("You:", `${json.magic.question}`, false)
                    .addField("8ball:", `${json.magic.answer}`, false)
                    .setColor("#000000")

                interaction.reply({
                    embeds: [embed],
                    ephemeral: false,
                })
            })
    },
}
