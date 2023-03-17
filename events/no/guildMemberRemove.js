// const { REST } = require('@discordjs/rest');
// const { Routes } = require('discord-api-types/v9');
// const epic = require('../epic.js')
// const { MessageEmbed } = require('discord.js')
require("dotenv").config()

module.exports = {
    name: "guildMemberRemove",
    once: false,
    async execute(member) {
        member.guild.channels.cache.get("985304015636135966").send(`${member.user.username}, has left!`)
    },
}
