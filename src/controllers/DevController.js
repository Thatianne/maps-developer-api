const axios = require('axios')
const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')
const { findConnections } = require('../websocket')

const methods = {
  async store(req, res) {
    try {
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
      }
      res.status(201)
      return res.json(dev)
    } catch(ex) {
      res.status(400)
      return res.json(ex)
    }
  },
  async index(req, res) {
    try {
      const devs = await Dev.find()
      return res.json(devs)
    } catch(ex) {
      res.status(400)
      return res.json(ex)
    }
  },
  async show(req, res) {
    try {
      const id = req.params.id
      const dev = await Dev.findById(id)
      return res.json(dev)
    } catch(ex) {
      res.status(404)
      res.send(ex)
    }
  },
  async delete(req, res) {
    const id = req.params.id
    const dev = await Dev.deleteOne({_id: id})
    res.status(200)
    return res.send()
  },
  async update(req, res) {
    try {
      const id = req.params.id
      const { techs, latitude, longitude } = req.body

      const techsArr = parseStringAsArray(techs)

      const location = {
        type: "Point",
        coordinates: [longitude, latitude]
      }

      const dev = await Dev.findByIdAndUpdate(id, {
        techs: techsArr,
        location
      })
      res.status(200)
      return res.send()
    } catch(ex) {
      res.status(404)
      return res.send(ex)
    }
  }
}

module.exports = methods