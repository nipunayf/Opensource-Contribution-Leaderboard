const Promise = require("bluebird")
const API = require('./util/API')
const jsonfile = require('jsonfile')

const dataPath = '../src/assets/data/data.json'
const logPath = '../src/assets/data/log.json'
const dataBuffer = jsonfile.readFileSync('../src/assets/data/data.json')

async function getAllContributorsInfo() {
    const Config = jsonfile.readFileSync('../config.json')
    const contributors = Config.contributors

    // Record logs
    jsonfile.writeFile(logPath, { timestamp: Date.now() } , { spaces: 2 }, (err) => {
        if (err) console.error(err)
    })

    Promise.mapSeries(contributors, contributor => {
        return Promise.delay(2000)
            .then( async () => {
                const organization = Config.organization
                API.getContributorInfo(organization, contributor).then( res => {
                    dataBuffer[`${contributor}`] = res
                    console.log(dataBuffer)
                    // Update contributors infomation
                    jsonfile.writeFile(dataPath, dataBuffer, { spaces: 2 }, (err) => {
                        if (err) console.error(err)
                    })
                })
            }).delay(10000)
    })
}

getAllContributorsInfo()
setInterval(getAllContributorsInfo, 5 * 60 * 1000)