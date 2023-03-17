const { SlashCommandBuilder } = require("@discordjs/builders")
const { getVoiceConnection } = require("@discordjs/voice")

module.exports = {
    data: new SlashCommandBuilder().setName("unpause").setDescription("Resume playback!"),
    async execute(interaction) {
        // Gets the voice connection in the current guild
        const connection = getVoiceConnection(interaction.guildId)

        // Check if a connection or a queue exists
        // || interaction.client.queueMap.get(interaction.guildId).queue.length == 0
        if (!connection || connection._state.subscription.player._state.status == "idle")
            return interaction.reply({ content: "There is nothing to unpause!" })

        // Check if player is playing
        if (connection._state.subscription.player._state.status == "playing")
            return interaction.reply("Already playing!")

        // Check if the member is in the same vc as the bot
        if (interaction.member.voice.channel != getVoiceConnection(interaction.guild.id).joinConfig.channelId)
            return interaction.reply("You need to be in the same voice channel as the bot!")

        // Unpause
        connection._state.subscription.player.unpause()

        // Reply
        await interaction.reply({
            content: "Resumed playback!",
            ephemeral: false,
        })
    },
}
