const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
require("dotenv").config()

module.exports = {
    name: "ready",
    once: true,
    execute(client, commands) {
        console.log(
            `Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`
        )
        client.user.setActivity("funnies", { type: "STREAMING", link: "https://www.twitch.tv/madasish" })

        const CLIENT_ID = client.user.id

        const rest = new REST(CLIENT_ID, {
            version: "9",
        }).setToken(process.env.TOKEN)

        ;(async () => {
            try {
                if (process.env.ENV === "production") {
                    await rest.put(Routes.applicationCommands(CLIENT_ID), {
                        body: commands,
                    })
                    console.log("Commands registered globally!")
                } else {
                    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, process.env.TESTING_GUILD_ID), {
                        body: commands,
                    })
                    console.log("Commands registered locally!")
                }
            } catch (err) {
                if (err) console.log(err)
            }
        })()
    },
}
