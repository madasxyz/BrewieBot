const { SlashCommandBuilder } = require("@discordjs/builders")
const os = require("os")
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sysinfo")
        .setDescription("Information about the system the bot is running on"),
    async execute(interaction) {
        const embed = new MessageEmbed()
            .setTitle(`System info`)
            .setDescription(`Info about the system the bot is running on.`)
            .addFields(
                { name: "CPU:", value: `${os.cpus()[0].model}`, inline: false },
                { name: "CPU frequency:", value: `${os.cpus()[0].speed / 1000} GHz`, inline: true },
                { name: "Threads:", value: `${os.cpus().length}`, inline: true },
                {
                    name: "RAM:",
                    value: `${Math.round(os.totalmem() / 1000000) - Math.round(os.freemem() / 1000000)} / ${Math.round(
                        os.totalmem() / 1000000
                    )} mb`,
                    inline: false,
                }
            )
            .setColor(process.env.EMBED_COLOUR)

        interaction.reply({
            embeds: [embed],
        })
    },
    disabled: true,
}
