module.exports = {
    randomCrashGif: function () {
        const gifs = require("./json/gifs.json")

        return gifs[Math.floor(Math.random() * (gifs.length - 0 + 1) + 0)]
    },

    mapSet: function (map, entry, key, value) {
        const theMap = map.get(entry)
        eval(`theMap.${key} = ${value}`)
        map.set(entry, theMap)
    },
}
