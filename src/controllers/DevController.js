const axios = require('axios')
const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')
const { findConnections } = require('../websocket')

const methods = {
  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body

    let dev = await Dev.findOne({ github_username })
    if (!dev) {
      const techsArr = parseStringAsArray(techs)

      const apiRes = await axios.get(`https://api.github.com/users/${github_username}`)

      const { name = login, avatar_url, bio } = apiRes.data

      const location = {
        type: "Point",
        coordinates: [longitude, latitude]
      }
      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArr,
        location
      })

      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArr
      )

      console.log(sendSocketMessageTo)
    }
    return res.json(dev)
  },
  async index(req, res) {
    const devs = await Dev.find()
    return res.json(devs)
  }
}

module.exports = methods