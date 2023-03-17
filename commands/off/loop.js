const { SlashCommandBuilder } = require("@discordjs/builders")
const { getVoiceConnection } = require("@discordjs/voice")

module.exports = {
    data: new SlashCommandBuilder().setName("loop").setDescription("Toggle looping the current song!"),
    async execute(interaction) {
        const channel = interaction.member.voice.channel
        const queueMap = interaction.client.queueMap

        if (queueMap.get(interaction.guildId)) {
            // Check for if youre in a vc
            if (channel != getVoiceConnection(channel.guild.id).joinConfig.channelId)
                return interaction.editReply("You need to be in the same voice channel as the bot!")

            var message = "I have no idea how you did this"

            if (queueMap.get(channel.guild.id).loop == false) {
                const map = queueMap.get(channel.guild.id)
                map.loop = true
                queueMap.set(channel.guild.id, map)
                message = "Now looping current song!"
            } else if (queueMap.get(channel.guild.id).loop == true) {
                const map = queueMap.get(channel.guild.id)
                map.loop = false
                queueMap.set(channel.guild.id, map)
                message = "Stopped looping current song!"
            }

            console.log(queueMap.get(channel.guild.id).loop)

            await interaction.reply({
                content: message,
                ephemeral: false,
            })
        } else {
            return interaction.reply("There is nothing to loop")
        }
    },
}
