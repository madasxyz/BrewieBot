const { SlashCommandBuilder } = require("@discordjs/builders")
const responses = require("../json/ping.json")

module.exports = {
    data: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),
    async execute(interaction, client) {
        const reply = await interaction.reply({
            content: `Ping?`,
            emphemeral: false,
            fetchReply: true,
        })

        const diff = reply.createdTimestamp - interaction.createdTimestamp
        const ping = client.ws.ping
        // return interaction.editReply(`Pong! 🏓 (Round trip took: ${diff}ms. Heartbeat: ${ping}ms.)`)

        let response
        switch (true) {
            case diff < 512:
                response = responses[0][Math.floor(Math.random() * responses[0].length)]
                break
            case diff < 1024 && diff > 512:
                response = responses[1][Math.floor(Math.random() * responses[1].length)]
                break
            case diff > 1024:
                response = responses[2][Math.floor(Math.random() * responses[2].length)]
                break
        }
        // const ping = Math.round(client.ws.ping);
        await interaction.editReply({ content: `${response} (Round trip: ${diff}ms. WS: ${ping}ms.)` })
    },
}
