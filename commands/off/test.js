const { SlashCommandBuilder } = require("@discordjs/builders")
// const { MessageEmbed } = require('discord.js')
// const epic = require('../epic')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("testing commands")
        .addStringOption((term) => term.setName("nickname").setRequired(true).setDescription("what nickname to set")),
    async execute(interaction) {
        interaction.reply("yeah")
    },
}
