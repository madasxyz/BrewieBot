const { SlashCommandBuilder, SlashCommandSubcommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const db = require("../database/schemas/UserAchievements")
const achievements = require("../../json/achievements.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("achievements")
        .setDescription("Report a user to the staff team. Misusing this command will result in punishment.")
        .addUserOption((user) => user.setName("member").setRequired(true).setDescription("The member to report"))
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("list")
                .setDescription("Shows the achievements that you have.")
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("info")
                .setDescription("Shows info about an achievement you have..")
                .addStringOption(
                    (achievement) => achievement.setName("achievement").setRequired(true).setDescription("Achievement.")
                )
        )
        
        ,
    async execute(interaction) {
        const give = function(memberID, achievementID) {
            db.findOne({ user_id: memberID }, (err, member) => {
                if(err) {
                    console.log(err)
                    return interaction.reply("An error has occurred")
                }

                if(member.achievements.includes(achievementID))
                    return interaction.reply("This member already has this achievement")

                if(!member) {
                    member = new db({
                        user_id: memberID,
                        achievements: [achievementID]
                    })
                } else {
                    member.achievements.push("achievementID")
                }

                member.save((err) => {
                    if (err) {
                        console.log(err)
                        interaction.reply("An error has occured")
                        return
                    }
                    interaction.reply(
                        `Member has been awarded the achievement ${achievementID}`
                    )
                })
            })
        }

        const remove = function(memberID, achievementID) {
            db.findOne({ user_id: memberID }, (err, member) => {
                if(err) {
                    console.log(err)
                    return interaction.reply("An error has occurred")}

                if(!member) return interaction.reply("This member has no achievements!")
                
                if(!member.achievements.includes(achievementID)) 
                    return interaction.reply("This member does not have this achievement!") 
                
                member.achievements.splice(member.achievements.indexOf(achievementID), 1)

                member.save((err) => {
                    if (err) {
                        console.log(err)
                        return interaction.reply("An error has occured")
                    }})
                    
                interaction.reply(`Member has been awarded the achievement ${achievementID}`)
                
            })
        }

        const getMetadata = function(ach_id) {
            return achievements[ach_id]}
        
        const claim = function(member, interaction) {
            let userms = Date.now()-interaction.member.joinedTimestamp
            // Member roles
            switch(true) {
                case userms>604800000:
                    give(member, 'veteran1')
                break;
                case userms>2629800000:
                    give(member, 'veteran2')
                break;
                case userms>15778800000:
                    give(member, 'veteran3')
                break;
            }
        }

        const userAchievements = function(user_id) {
            db.findOne({ user_id: memberID }, (err, member) => {
                if(err) {
                    console.log(err)
                    return interaction.reply("An error has occured")
                }
                member.achievements.sort()
                return member.achievements
            })
        }

        switch (interaction.options.getSubcommand()) {
            case "info":
                const lower = userAchievements(interaction.user.id).map(element => {
                    return element.toUpperCase();
                  });
                if(!interaction.options.getString('achievement').toLowerCase() in lower)
                    return interaction.reply("You do not have this achievement!")
                
            break;
            case "list":

            break;
    },
}
