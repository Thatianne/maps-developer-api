const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')

const methods = {
  async index(req, res) {
    const { latitude, longitude, techs } = req.query
    const techsArr = parseStringAsArray(techs)

    const devs = await Dev.find({
      techs: {
        $in: techsArr
      },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(longitude), Number(latitude)]
          },
          $maxDistance: 10000
        },
      }
    })

    return res.json(devs)
  }
}

module.exports = methods