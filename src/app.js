const compress = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const logger = require('./logger')

const feathers = require('@feathersjs/feathers')
const configuration = require('@feathersjs/configuration')
const express = require('@feathersjs/express')
const socketio = require('@feathersjs/socketio')

const middleware = require('./middleware');
const services = require('./services')
const appHooks = require('./app.hooks')
const channels = require('./channels')

const mongoose = require('./mongoose')
const redis = require('./redis')
const sequelize = require('./sequelize');

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
app.configure(sequelize)
app.configure(middleware)
app.configure(services)
app.configure(channels)

const request = app.service('zabbix-history')

app.get("/add", async (req, res) => {
  request.create({
    zabbix_cli_id: 'sdfd',
    itemid: 'Messagedsfsdfdsfver',
    clock: 'dsfdsfdsfs',
    value: 'Messagdfewrwerr43ever',
    ns: 'fsdfs4r4f3',

  })
    .then(message => {
      console.log('Created message', message)
    },
      err => {
      console.log(err)
      })
})




app.use(express.notFound())
app.use(express.errorHandler({logger}))

app.hooks(appHooks)

module.exports = app
