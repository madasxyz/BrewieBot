const mongoose = require("mongoose")

const UserAchievementsSchema = new mongoose.Schema({
    user_id: String,
    achievements: Array,
})

module.exports = mongoose.model("UserAchievements", UserAchievementsSchema)
