const { SlashCommandBuilder, SlashCommandSubcommandBuilder } = require("@discordjs/builders")
var { fromIsoToHuman } = require("@sineverba/date-convert")
const { MessageEmbed } = require("discord.js")
const ud = require("urban-dictionary")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("urban")
        .setDescription("Find definitions of words on urban dictionary.")
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("define")
                .setDescription("Get the definition of a word from Urban Dictionary.")
                .addStringOption((term) => term.setName("term").setRequired(true).setDescription("Term to search for"))
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder().setName("wotd").setDescription("Urban Dictionary word of the day.")
        ),
    async execute(interaction) {
        interaction.deferReply({ ephemeral: false })

        if (interaction.options.getSubcommand() === "define") {
            const theWordsIdk = interaction.options.getString("term")
            ud.define(theWordsIdk, (error, results) => {
                try {
                    if (error) console.log(error)

                    const finalResult = results.sort((a, b) => b.thumbs_up - a.thumbs_up)[0]

                    const embed = new MessageEmbed()
                        .setTitle(`Definition of ${finalResult.word}`)
                        .setURL(`${finalResult.permalink}`)
                        .setDescription(`${finalResult.definition}`)
                        .addFields(
                            { name: "Example", value: `${finalResult.example}`, inline: false },
                            { name: "👍", value: `${finalResult.thumbs_up}`, inline: true },
                            { name: "👎", value: `${finalResult.thumbs_down}`, inline: true }
                        )
                        .setColor(process.env.EMBED_COLOUR)
                        .setFooter({
                            text: `by ${finalResult.author} on ${fromIsoToHuman(finalResult.written_on, "DD/MM/YYYY")}`,
                        })

                    interaction.editReply({
                        embeds: [embed],
                    })
                } catch (error) {
                    interaction.editReply("Something went wrong!")
                }
            })
        } else if (interaction.options.getSubcommand() === "wotd") {
            /*
            at some point might wanna add something like pagination embed to this subcommand
            */
            ud.wordsOfTheDay((error, results) => {
                if (error) console.log(error)

                const finalResult = results[0]

                const embed = new MessageEmbed()
                    .setTitle(`Word of the day: ${finalResult.word}`)
                    .setURL(`${finalResult.permalink}`)
                    .setDescription(`${finalResult.definition}`)
                    .addFields(
                        { name: "Example", value: `${finalResult.example}`, inline: false },
                        { name: "👍", value: `${finalResult.thumbs_up}`, inline: true },
                        { name: "👎", value: `${finalResult.thumbs_down}`, inline: true }
                    )
                    .setColor(process.env.EMBED_COLOUR)
                    .setFooter({
                        text: `by ${finalResult.author} on ${fromIsoToHuman(finalResult.written_on, "DD/MM/YYYY")}`,
                    })

                interaction.editReply({
                    embeds: [embed],
                    ephemeral: false,
                })
            })
        }
    },
}
