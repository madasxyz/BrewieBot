const { SlashCommandBuilder } = require("@discordjs/builders")
const { getVoiceConnection } = require("@discordjs/voice")

module.exports = {
    data: new SlashCommandBuilder().setName("disconnect").setDescription("Makes the bot leave vc!"),
    async execute(interaction) {
        // Gets the voice connection in the current guild
        const connection = getVoiceConnection(interaction.guildId)

        // Check if the member is in the same vc as the bot
        if (interaction.member.voice.channel != getVoiceConnection(interaction.guild.id).joinConfig.channelId)
            return interaction.reply("You need to be in the same voice channel as the bot!")

        // Destroys the connection
        connection.destroy()

        // If a queue exists, delete it
        if (interaction.client.queueMap.has(interaction.guildId))
            interaction.client.queueMap.delete(interaction.guildId)

        // Reply
        await interaction.reply({
            content: "Goodbye!",
            ephemeral: false,
        })
    },
}
