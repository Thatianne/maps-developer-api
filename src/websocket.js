const socketio = require('socket.io')
const parseStringAsArray = require('./utils/parseStringAsArray')
const calculateDistance = require('./utils/calculateDistance')

const connections = []

exports.setupWebsocket = server => {
  const io = socketio(server);

  io.on('connection', socket => {
    console.log(socket.id)

    const { latidude, longitude, techs } = socket.handshake.query
    connections.push({
      id: socket.id,
      coordinates: {
        latidude: Number(latidude),
        longitude: Number(longitude),
      },
      techs: parseStringAsArray(techs)
    })
  })
}

exports.findConnections = (coordinates, techs) => {
  return connections.filter(connection => {
    return calculateDistance(coordinates, connection.coordinates) < 10
      && connections.techs.some(tech => techs.includes(tech))
  })
}