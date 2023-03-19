const { SlashCommandBuilder, SlashCommandSubcommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const db = require("../database/schemas/UserAchievements")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("achievements")
        .setDescription("Report a user to the staff team. Misusing this command will result in punishment.")
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
            .setName("list")
            .setDescription("Shows the achievements that you have.")
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
            .setName("info")
            .setDescription("Shows info about an achievement you have..")
            .addStringOption((achievement) => achievement.setName("achievement").setRequired(true).setDescription("The achievement."))
        )
        ,
    async execute(interaction) {

        interaction.client.achievement.update(interaction.user.id)

        switch (interaction.options.getSubcommand()) {
            case "info":
                var input = interaction.options.getString('achievement').toLowerCase()
                
                db.findOne({ user_id: interaction.user.id }, function(err, member) {
                    if(err) return console.log(err)

                    let meta = interaction.client.achievement.getMetadata(input)

                    member.achievements.sort()
                    
                    if(!member.achievements.includes(input)) 
                        return interaction.reply("You do not have this achievement!")

                    let embed = new MessageEmbed()
                        .setTitle(`${meta.icon} ${meta.displayName}`)
                        .setColor('#2f3136')
                        .setDescription(`${meta.description}${meta.secret==true ? '\n\n<:invisible:996443280470454372> *This achievement is meant to be secret! Shh!*' : ''}`)
                        .addField('Rarity', meta.rarity)
                        .setFooter({text: `Achievement ID: ${meta.id}`})

                    interaction.reply({ embeds: [embed], ephemeral: meta.secret })
                })
            break;
            case "list":
                db.findOne({ user_id: interaction.user.id }, function(err, member) {
                    if(err) return console.log(err)

                    member.achievements.sort()

                    var achievedList = []

                    member.achievements.forEach(achievement => {
                        let meta = interaction.client.achievement.getMetadata(achievement)
                        achievedList.push(`**${meta.icon} ${meta.displayName}** • ${meta.rarity}`)
                    })

                    let embed = new MessageEmbed()
                        .setAuthor({ name: `${interaction.member.displayName}'s achievements`, iconURL: interaction.user.avatarURL({ dynamic:true }) })
                        .setDescription(`${member.achievements.length<1 ? 'None' : achievedList.join('\n')}`)
                        .setColor('#2f3136')
                        .setFooter({text: '💡 Inspect using /achievement inspect'})

                    interaction.reply({embeds: [embed], ephemeral: false})
                })
            break;
        }
    },
}
