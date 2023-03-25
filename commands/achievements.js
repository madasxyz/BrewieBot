const { SlashCommandBuilder, SlashCommandSubcommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const db = require("../database/schemas/UserAchievements")
const adb = require("../database/schemas/Achievements")

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

        interaction.client.ac.update(interaction)

        switch (interaction.options.getSubcommand()) {
            case "info":
                var input = interaction.options.getString('achievement')
                
                db.findOne({ user_id: interaction.user.id }, async function(err, member) {
                    if(err) return console.log(err)

                    let meta = await interaction.client.ac.findByDisplay(input)

                    if(!meta) return interaction.reply("No such achievement!")

                    if(!member.achievements.includes(meta.id))
                        return interaction.reply("You do not have this achievement!")

                    let embed = new MessageEmbed()
                        .setTitle(`${meta.icon} ${meta.displayName}`)
                        .setColor('#2f3136')
                        .setDescription(`${meta.description}${meta.secret==true ? '\n\n<:invisible:996443280470454372> *This achievement is meant to be secret! Shh!*' : ''}`)
                        .addFields({name: 'Rarity', value: meta.rarity})
                        .setFooter({text: `Achievement ID: ${meta.id}`})

                    interaction.reply({ embeds: [embed], ephemeral: meta.secret })
                })
            break;
            case "list":
                db.findOne({ user_id: interaction.user.id }, function(err, member) {
                    if(err) return console.log(err)

                    if(!member) return interaction.reply("You do not have any achievements!")

                    member.achievements.sort()
                    
                    const memberAchievementsFancy = async () => {
                        var achievedList = []
                        for(let i=0; i < member.achievements.length; i++) {
                            let meta = await adb.findOne({ id: member.achievements[i]})
                            achievedList.push(`**${meta.icon} ${meta.displayName}** • ${meta.rarity}`)
                        }
                        return achievedList
                    }
                    
                    memberAchievementsFancy().then((list) => {
                        let embed = new MessageEmbed()
                        .setAuthor({ name: `${interaction.member.displayName}'s achievements`, iconURL: interaction.user.avatarURL({ dynamic:true }) })
                        .setDescription(`${member.achievements.length<1 ? 'None' : list.join('\n')}`)
                        .setColor('#2f3136')
                        .setFooter({text: '💡 Get more info using /achievement info'})

                        interaction.reply({embeds: [embed], ephemeral: false})
                    })
                })
            break;
        }
    },
}
