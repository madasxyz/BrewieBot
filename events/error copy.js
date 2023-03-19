module.exports = {
    name: "error",
    once: false,
    run(error) {
        console.log("[ERROR] ", error)
    },
}
