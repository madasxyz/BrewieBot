const db = require("../database/schemas/UserAchievements")
const achievements = require("../json/achievements.json")

module.exports = {
    give: function(memberID, achievementID) {
        db.findOne({ user_id: memberID }, (err, member) => {
            if(err) return console.log(err)

            if(!member) {
                member = new db({
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
    },

    remove: function(memberID, achievementID) {
        db.findOne({ user_id: memberID }, (err, member) => {
            if(err) return console.log(err)
            
            member.achievements.splice(member.achievements.indexOf(achievementID), 1)

            member.save((err) => {
                if(err) return console.log(err)})
                
            console.log(`${memberID} has had the achievement ${achievementID} removed`)
            
        })
    },

    getMetadata: function(ach_id) {
        return achievements[ach_id]
    },
    
    update: function(memberID, interaction) {
        let userms = Date.now()-interaction.member.joinedTimestamp
        // Member roles
        switch(true) {
            case userms>604800000:
                this.give(memberID, 'veteran1')
            break;
            case userms>2629800000:
                this.give(memberID, 'veteran2')
            break;
            case userms>15778800000:
                this.give(memberID, 'veteran3')
            break;
        }
    },

    list: function(memberID) {
        db.findOne({ user_id: memberID }, function(err, member) {
            if(err) return console.log(err)
            member.achievements.sort()
            return member.achievements
        })
    }
}