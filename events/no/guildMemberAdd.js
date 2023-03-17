// const { REST } = require('@discordjs/rest');
// const { Routes } = require('discord-api-types/v9');
// const epic = require('../epic.js')
// const { MessageEmbed } = require('discord.js')
const GuildSettings = require("../models/GuildSettings")
require("dotenv").config()

module.exports = {
    name: "guildMemberAdd",
    once: false,
    async execute(member) {
        const guildSettings = await GuildSettings.findOne({ guild_id: member.guild.id })
        if ((!guildSettings && !guildSettings.welcome_channel_id) || guildSettings.welcome_enabled === false) return
        member.guild.channels.cache.get(guildSettings.welcome_channel_id).send(`${member.user.username}, welcome!`)
    },
}
