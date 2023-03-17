const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder().setName("queue").setDescription("List all songs in the queue!"),
    async execute(interaction) {
        const queueMap = interaction.client.queueMap

        if (queueMap.get(interaction.guildId)) {
            var message = "Queue: ```"

            for (var i = 0; i < queueMap.get(interaction.guildId).queue.length; i++) {
                message += i + 1 + ". " + queueMap.get(interaction.guildId).queue[i].title + "\n"
            }

            message += "```"

            await interaction.reply({
                content: message,
                ephemeral: false,
            })
        } else {
            return interaction.reply("The queue is empty!")
        }
    },
}
