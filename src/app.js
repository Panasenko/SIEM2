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
app.use(express.urlencoded({ extended: true }))

app.configure(express.rest())
app.configure(socketio())

app.configure(mongoose)
app.configure(redis)

app.configure(services)

app.configure(channels)



//const redis = require('redis')

//const client = redis.createClient(app.get('redis'));




const redisCli = app.service("redis")

app.get("/test",  async (req, res) => {

  const params = {
    key: "string1"
  }

 // const result = redisCli.find(params).then(it => res.send(it))
 const ress =  await redisCli.find(params)

  res.send(await ress)

  // redisCli.set("string1", "strin244444444444444444444444444444g", redis.print)
})

app.use(express.notFound())
app.use(express.errorHandler({ logger }))

app.hooks(appHooks)

module.exports = app
