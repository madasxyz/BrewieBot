#!/home/madas/.nvm/versions/node/v16.16.0/bin/node
require("dotenv").config()
require("console-stamp")(console, "[HH:MM:ss.l]")
const fs = require("fs")
const Database = require("./config/Database")
const { Client, Intents, Collection } = require("discord.js")

const db = new Database()
db.connect()

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ],
})

client.queueMap = new Map()
client.utils = require("./utils.js")

// Load all commands
const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"))
const commands = []
client.commands = new Collection()

for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    commands.push(command.data.toJSON())
    client.commands.set(command.data.name, command)
}

//load all events
const eventFiles = fs.readdirSync("./events").filter((file) => file.endsWith(".js"))
for (const file of eventFiles) {
    const event = require(`./events/${file}`)

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, commands, client, client.commands))
    } else {
        client.on(event.name, (...args) => event.execute(...args, commands, client.commands))
    }
}

client.login(process.env.TOKEN)
