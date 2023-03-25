const mongoose = require("mongoose")

const Achievements = new mongoose.Schema({
    id: String,
    displayName: String,
    description: String,
    rarity: String,
    icon: String,
    group: Number,
    secret: Boolean
})

module.exports = mongoose.model("Achievements", Achievements)
