// const { MessageActionRow } = require("discord.js");

module.exports = {
    randomCrashGif: function() {
        const gifs = require("./json/gifs.json")

        return gifs[Math.floor(Math.random() * (gifs.length - 0 + 1) + 0)]
    },

    mapSet: function(map, entry, key, value) {
        const theMap = map.get(entry)
        eval(`theMap.${key} = ${value}`)
        map.set(entry, theMap)
    },

    random: function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    },
    time: function(ms, decimals=0, hideS, shortTime) {
        function timeStr(amount, str) { 
            amount = +amount
            return `${amount} ${str}${amount == 1 ? "" : "s"}`
        }
        ms = Math.abs(ms)
        let seconds = (ms / 1000).toFixed(0)
        let minutes = (ms / (1000 * 60)).toFixed(decimals)
        let hours = (ms / (1000 * 60 * 60)).toFixed(decimals)
        let days = (ms / (1000 * 60 * 60 * 24)).toFixed(decimals)
        if ( seconds < 1 ) return timeStr((ms / 1000).toFixed(2), shortTime ? "sec" : "second")
        if ( seconds < 60 ) return timeStr(seconds, shortTime ? "sec" : "second")
        else if ( minutes < 60 ) return timeStr(minutes, shortTime ? "min" : "minute")
        else if (hours <= 24) return timeStr(hours, "hour")
        else return timeStr(days, "day")
    },
    timestamp: function (ms, useTimeIfLong) {
        if (useTimeIfLong && ms >= 86399000) return this.time(ms, 1)
        let secs = Math.ceil(Math.abs(ms) / 1000)
        if (secs < 0) secs = 0
        let days = Math.floor(secs / 86400)
        if (days) secs -= days * 86400
        let timestamp = `${ms < 0 ? "-" : ""}${days ? `${days}d + ` : ""}${[Math.floor(+secs / 3600), Math.floor(+secs / 60) % 60, +secs % 60].map(v => v < 10 ? "0" + v : v).filter((v,i) => v !== "00" || i > 0).join(":")}`
        if (timestamp.length > 5) timestamp = timestamp.replace(/^0+/, "")
        return timestamp
    },
    addS: function(string) {
        if (string.endsWith('s')) return `'`; else return `'s`
    },
    choose: function(array) {
        return array[Math.floor(Math.random() * array.length)]
    }
}
