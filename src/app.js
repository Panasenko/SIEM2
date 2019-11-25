const compress = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const logger = require('./logger')

const feathers = require('@feathersjs/feathers')
const configuration = require('@feathersjs/configuration')
const express = require('@feathersjs/express')
const socketio = require('@feathersjs/socketio')

const services = require('./services')
const appHooks = require('./app.hooks')
const channels = require('./channels')

const mongoose = require('./mongoose')
const redis = require('./redis')

const app = express(feathers())


app.configure(configuration())

app.use(helmet())
app.use(cors())
app.use(compress())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.configure(express.rest())
app.configure(socketio())

app.configure(mongoose)
app.configure(redis)

app.configure(services)

app.configure(channels)

const service = app.service('redis')

app.get("/hset", async (req, res) => {
  let result = await service.create({
    id: "user:4:db",
    name: "maks"
  })
  return res.json(result)

})

app.get("/hget", async (req, res) => {
  let result = await service.get("user:4:db")
  return res.json(result)
})

app.get("/hdel", async (req, res) => {
  let result = await service.remove("user:4:db")
  return res.json(result)
})

app.use(express.notFound())
app.use(express.errorHandler({logger}))

app.hooks(appHooks)

module.exports = app
