const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder().setName("stats").setDescription("Bots stats"),
    async execute(interaction, client) {
        const embed = new MessageEmbed()
            .setTitle("Stats")
            .addField("Server count", `${client.guilds.cache.size}`, true)
            .addField("Channel count", `${client.channels.cache.size}`, true)
            .addField("User count", `${client.users.cache.size}`, true)
            .addField("Language", "Javascript", true)
            .setColor(process.env.EMBED_COLOUR)

        interaction.reply({
            embeds: [embed],
            emphemeral: true,
        })
    },
}
