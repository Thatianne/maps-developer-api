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
            coordinates: [-38.953645, -12.2461238]
          },
          $maxDistance: 10000
        },
      }
    })

    console.log(techsArr)

    return res.json(devs)
  }
}

module.exports = methods