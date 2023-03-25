const achievement = require("../modules/achievement")

module.exports = {
    name: "messageCreate",
    once: false,
    execute(message) {
        if(message.author.bot) return;
        if(message.guild == null) {
            achievement.give(message.author.id, "directmessage")
        }
    },
}