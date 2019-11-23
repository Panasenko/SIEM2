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
//app.configure(redis)

app.configure(services)

app.configure(channels)




const api = app.service("zabbix-api")

app.get("/test",  async (req, res) => {

  const method = "history.get"

  const params = {
    url: "http://192.168.0.103/zabbix/api_jsonrpc.php",
    token: "b1a13284396c5c2030dce37993375561",
    reqParam: {
      itemids: [ '23300', '28500', '23304' ],
      time_from: 1574519713,
      history: 0
    }
  }

 const ress =  await api.find({method, args: params}).then(it => res.send(it), err => {console.log(err)})

  res.send(await ress)

})

app.use(express.notFound())
app.use(express.errorHandler({ logger }))

app.hooks(appHooks)

module.exports = app
