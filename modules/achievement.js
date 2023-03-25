const udb = require("../database/schemas/UserAchievements")
const adb =  require("../database/schemas/Achievements")
// const achievements = require("../json/achievements.json")

module.exports = {
    give: function(memberID, achievementID) {
        udb.findOne({ user_id: memberID }, (err, member) => {
            if(err) return console.log(err)
            adb.findOne({id: achievementID }, (err, ach) => {
                if(err) return console.log(err)
                if(!ach) return console.log(`There is no achievement "${achievementID}"!`)
                if(!member) {
                    member = new udb({
                        user_id: memberID,
                        achievements: [achievementID]
                    })
                } else {
                    if(member.achievements.includes(achievementID))
                        return console.log(`${memberID} already has ${achievementID}`)
                    member.achievements.push(achievementID)
                }
    
                member.save((err) => {
                    if (err) return console.log(err)
                    console.log(`${memberID} has been awarded the achievement ${achievementID}`)
                })
            })
        })
    },

    remove: function(memberID, achievementID) {
        udb.findOne({ user_id: memberID }, (err, member) => {
            if(err) return console.log(err)
            
            member.achievements.splice(member.achievements.indexOf(achievementID), 1)

            member.save((err) => {
                if(err) return console.log(err)})
                
            console.log(`${memberID} has had the achievement ${achievementID} removed`)
            
        })
    },

    getMetadata: async function(achievementID) {
        let metadata = await adb.findOne({ id: achievementID })
        return metadata
    },
    
    update: function(interaction) {
        let userms = Date.now()-interaction.member.joinedTimestamp
        if(!(userms>604800000)) return
        this.give(interaction.user.id, 'veteran1')
        if(!(userms>2629800000)) return
        this.give(interaction.user.id, 'veteran2')
        if(!(userms>15778800000)) return
        this.give(interaction.user.id, 'veteran3')
    },

    list: function(memberID) {
        udb.findOne({ user_id: memberID }, function(err, member) {
            if(err) return console.log(err)
            member.achievements.sort()
            return member.achievements
        })
    },
    findByDisplay: async function(displayName) {
        let meta = await adb.findOne({ displayName: new RegExp(displayName.toLowerCase(), "i") })
        return meta
    },
    deleteUser: async function(user_id) {
        await udb.deleteOne({ user_id: user_id })
            .then(a => {
                console.log(`Deleted ${a} user!`)
            })
    }
}