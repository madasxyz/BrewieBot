const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("Show info about the song that is currently playing!"),
    async execute(interaction) {
        // const channel = interaction.member.voice.channel
        const queueMap = interaction.client.queueMap

        if (queueMap.get(interaction.guildId)) {
            var message = "I have no idea how you did this"

            const first = queueMap.get(interaction.guildId).queue[0]

            message = `Currently playing: **${first.title}** by **${first.author.name}**`

            await interaction.reply({
                content: message,
                ephemeral: false,
            })
        } else {
            return interaction.reply("Nothing is currently playing!")
        }
    },
}

// {
//     type: 'video',
//     videoId: 'rg6fQMLB8Tk',
//     url: 'https://youtube.com/watch?v=rg6fQMLB8Tk',
//     title: 'Genshin Impact - Full OST (Updated - Part 1) w/ Timestamps',
//     description: 'Tracklist : Part 1 - The Wind and the Star Traveler : 01. Genshin Impact Main Theme : 00:00 02. Dawn Winery Theme : 01:46 03.',
//     image: 'https://i.ytimg.com/vi/rg6fQMLB8Tk/hq720.jpg',
//     thumbnail: 'https://i.ytimg.com/vi/rg6fQMLB8Tk/hq720.jpg',
//     seconds: 40429,
//     timestamp: '11:13:49',
//     duration: {
//       toString: [Function: toString],
//       seconds: 40429,
//       timestamp: '11:13:49'
//     },
//     ago: '3 months ago',
//     views: 258051,
//     author: {
//       name: 'Lynfinity Music',
//       url: 'https://youtube.com/@LynfinityMusic'
//     }
//   }
