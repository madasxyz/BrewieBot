const { SlashCommandBuilder } = require("@discordjs/builders")
const { WebhookClient, MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("report")
        .setDescription("Report a user to the staff team. Misusing this command will result in punishment.")
        .addUserOption((user) => user.setName("member").setRequired(true).setDescription("The member to report"))
        .addStringOption((reason) =>
            reason.setName("reason").setRequired(true).setDescription("The reason you are reporting them")
        )
        .addStringOption((proof) => proof.setName("proof").setDescription("Evidence to prove your report")),
    async execute(interaction) {
        let embed = new MessageEmbed()
            .setTitle(`Report from: ${interaction.user.tag}`)
            .setColor("RED")
            .addFields(
                { name: "User", value: `<@${interaction.options.getUser("member").id}>` },
                { name: "Reason", value: interaction.options.getString("reason") },
                {
                    name: "Evidence",
                    value: !interaction.options.getString("proof") ? "None." : interaction.options.getString("proof"),
                }
            )
        console.log(embed)
        new WebhookClient({ id: process.env.WEBHOOK_ID, token: process.env.WEBHOOK_TOKEN }).send({
            embeds: [embed],
        })
        interaction.reply({ content: "🚩 Thank you for reporting this user. We will look into it.", ephemeral: true })
    },
}
