const fs = require("fs")
const assert = require("assert")
const OpenWeatherAPI = require("../index")

// ! Remeber to specify key in key.txt file
let key = fs.readFileSync("./test/key.txt").toString().trim()

let weather = new OpenWeatherAPI({
    key: key
})


describe("Getting tests:", function () {
    this.timeout(10000)

    it("gets location", async () => {
        weather.setLocationByCoordinates(40.71, -74)
        let location = await weather.getLocation()
        assert(location.name === "New York City")
    })

    it("gets current", async () => {
        weather.setLocationByName("warsaw")
        let current = await weather.getCurrent()
        assert(typeof current.weather.temp.cur === "number")
    })

    it("gets minutely", async () => {
        weather.setLocationByCoordinates(40.71, -74)
        let minutely = await weather.getMinutelyForecast(48)
        if (!minutely.length) {
            console.log("\t\x1b[31mPuste minutely: ", minutely)
            assert(typeof minutely === "object")
        } else {
            assert(minutely.length == 48 && typeof minutely[Math.floor(Math.random() * 40)].weather.rain === "number")
        }
    })

    it("gets hourly", async () => {
        weather.setLocationByZipCode("E14,GB")
        let hourly = await weather.getHourlyForecast(10)
        if (!hourly.length) {
            console.log("\t\x1b[31mPuste hourly: ", hourly)
            assert(typeof hourly === "object")
        } else {
            assert(hourly.length == 10 && typeof hourly[Math.floor(Math.random() * 5)].weather.rain === "number")
        }
    })

    it("gets daily", async () => {
        weather.setLocationByCoordinates(10, -40)
        let daily = await weather.getDailyForecast(3)
        if (!daily.length) {
            console.log("\t\x1b[31mPuste daily: ", daily)
            assert(typeof daily === "object")
        } else {
            assert(daily.length == 3 && typeof daily[Math.floor(Math.random() * 2)].weather.rain === "number")
        }
    })

    it("gets alerts", async () => {
        weather.setLocationByName("Giza")
        let alerts = await weather.getAlerts()
        assert(true)
    })

    it("gets everything", async () => {
        weather.setLocationByCoordinates(0, 0)
        let everything = await weather.getEverything()
        assert(typeof everything.current.weather.temp.cur === "number" && typeof everything.minutely === "object" && typeof everything.hourly[Math.floor(Math.random() * 20)].weather.rain === "number" && typeof everything.daily[Math.floor(Math.random() * 5)].weather.rain === "number")
    })

    it("gets history", async () => {
        weather.setLocationByCoordinates(49.84, 24.03)
        let date = new Date().getTime() - 900000
        let history = await weather.getHistory(date)
        assert(Math.round(date / 1000) == history.current.dt_raw)
    })

})
