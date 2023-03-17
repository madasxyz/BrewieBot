const { SlashCommandBuilder } = require("@discordjs/builders")
const { getVoiceConnection } = require("@discordjs/voice")

module.exports = {
    data: new SlashCommandBuilder().setName("pause").setDescription("Pause whatever is currently playing."),
    async execute(interaction) {
        // Gets the voice connection in the current guild
        const connection = getVoiceConnection(interaction.guildId)

        // Checks if theres a connection
        if (!connection) return interaction.reply({ content: "The bot is not currently playing anything!" })

        // /eval eval: require("@discordjs/voice").getVoiceConnection(interaction.guildId)._state.subscription.player._state.status
        // Check if player is playing
        if (connection._state.subscription.player._state.status == "paused") return interaction.reply("Already paused!")

        // Check if the member is in the same channel as the bot
        if (interaction.member.voice.channel != getVoiceConnection(interaction.guild.id).joinConfig.channelId)
            return interaction.reply("You need to be in the same voice channel as the bot!")

        // Pause
        connection._state.subscription.player.pause()

        // Reply
        await interaction.reply({
            content: "Paused!",
            ephemeral: false,
        })
    },
}
