const { SlashCommandBuilder } = require("@discordjs/builders")
const {
    joinVoiceChannel,
    createAudioResource,
    createAudioPlayer,
    AudioPlayerStatus,
    getVoiceConnection,
} = require("@discordjs/voice")
const ytdl = require("ytdl-core")
const yts = require("yt-search")
// const util = require("")
// const ch = require('chalk')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play music in voice chats!")
        .addStringOption((query) => query.setName("query").setDescription("Video to search for")),
    async execute(interaction) {
        const map = interaction.client.queueMap

        const channel = interaction.member.voice.channel

        await interaction.deferReply({
            ephemeral: false,
        })

        // Check for if youre in a vc
        if (!channel) return interaction.editReply("You need to be in a voice channel!")

        // Check if a queue exists for the server youre in
        if (!map.get(channel.guild.id)) {
            if (interaction.options._hoistedOptions.length < 1)
                return interaction.editReply("You need to provide a query!")

            // if(!interaction.options._hoistedOptions) return interaction.editReply("You must provide a query!")

            console.log("Music queue doesnt exist")

            const results = await yts({ query: interaction.options._hoistedOptions[0].value, type: "video" })
            const result = results.videos[0]

            map.set(channel.guild.id, {
                thechannel: interaction.channel.id,
                queue: [result],
                loop: false,
            })

            const gqGet = map.get(channel.guild.id)

            console.log("Music queue created")

            const getNextSong = function () {
                // const map = queueMap.get(channel.guild.id)
                // map.loop = true
                // queueMap.set(channel.guild.id, map)

                const the = interaction.client.queueMap.get(interaction.guildId)
                console.log(the)
                the.queue = the.queue.slice(1)
                console.log(the)
                interaction.client.queueMap.set(channel.guild.id, the)

                return createAudioResource(ytdl(gqGet.queue[0].url))
            }

            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            })

            const player = createAudioPlayer()

            const resource = createAudioResource(ytdl(gqGet.queue[0].url, { filter: "audioonly" }))

            connection.subscribe(player)

            player.play(resource) || console.log("not playing")

            player.on("error", (error) => {
                console.error("Error:", error.message, "with track")
            })

            player.on(AudioPlayerStatus.Idle, () => {
                console.log(`Idling in ${interaction.guildId}`)

                if (gqGet.loop == true) {
                    console.log(`Looping in ${interaction.guildId}`)
                    player.play(createAudioResource(ytdl(gqGet.queue[0].url)))
                    return
                } else {
                    if (gqGet.queue.length <= 1) {
                        map.delete(interaction.guildId)
                    } else {
                        player.play(getNextSong())
                        console.log(`Playing next song "${gqGet.queue[0].title}" in ${interaction.guild}`)
                    }
                }
            })
            console.log(gqGet)
            console.log(`Playing "${gqGet.queue[0].title}" in ${interaction.guild} (${interaction.guildId})`)

            await interaction.editReply(`Playing "${gqGet.queue[0].title}"`)
        } else if (map.get(channel.guild.id).queue) {
            console.log("queue exists")

            if (interaction.options._hoistedOptions.length < 1) {
                const connection = getVoiceConnection(channel.guild.id)

                if (!connection || connection._state.subscription.player._state.status == "idle")
                    return interaction.editReply({ content: "There is nothing to unpause!" })

                // Check if player is playing
                if (connection._state.subscription.player._state.status == "playing")
                    return interaction.editReply("Already playing!")

                // Check if the member is in the same vc as the bot
                if (interaction.member.voice.channel != getVoiceConnection(interaction.guild.id).joinConfig.channelId)
                    return interaction.editReply("You need to be in the same voice channel as the bot!")

                // Unpause
                connection._state.subscription.player.unpause()

                return interaction.editReply("Resumed playback!")
                // ._state.subscription.player._state.status
            } else {
                if (channel != getVoiceConnection(channel.guild.id).joinConfig.channelId)
                    return interaction.editReply("You need to be in the same voice channel as the bot!")

                const results = await yts({ query: interaction.options._hoistedOptions[0].value, type: "video" })
                const result = results.videos[0]
                const video = map.get(channel.guild.id).queue.push(result)
                map.set(channel.guild.id.queue, video)

                console.log(`Added "${result.title}" to the queue in ${interaction.guildId}`)

                await interaction.editReply(`Added "${result.title}" to the queue!`)
            }
        } else {
            await interaction.editReply("Something went seriously wrong!")
        }
    },
}
