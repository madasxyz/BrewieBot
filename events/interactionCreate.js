// const { REST } = require('@discordjs/rest');
// const { Routes } = require('discord-api-types/v9');
const { MessageEmbed } = require("discord.js")
require("dotenv").config()

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction) {
        if (!interaction.isCommand()) return

        const command = interaction.client.commands.get(interaction.commandName)

        if (!command) return

        try {
            await command.execute(interaction, interaction.client)
        } catch (error) {
            if (error) console.log(error)
            const embed = new MessageEmbed()
                .setDescription(`Something went wrong!`)
                .setImage(`${interaction.client.utils.randomCrashGif()}`)
                .setColor("#ff5c5c")

            try {
                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                })
            } catch (error) {
                try {
                    await interaction.editReply({
                        embeds: [embed],
                        ephemeral: true,
                    })
                } catch (error) {
                    return
                }
            }
        }
    },
}
