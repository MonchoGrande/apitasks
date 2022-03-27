const http = require('http')
const app = require('./server')
const config = require('./server/config')
const database = require('./server/db')

const { port } = config.server

database.connect(config.database, {})

const server = http.createServer(app)

server.listen(port, () => {
  console.log(`server on running on port: ${port}`)
})
