const mongoose = require('mongoose')
const config = require('../config/config')

const URL_DB = `mongodb://${config.mongoDB.DB_IP}:${config.mongoDB.DB_PORT}/${config.mongoDB.DB_COLLECTION}`

mongoose.connect(URL_DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})

mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + URL_DB)
})
mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: ' + err)
})
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected')
})

gracefulShutdown = function(msg, callback) {
    mongoose.connection.close(function() {
        console.log('Mongoose disconnected through ' + msg)
        callback()
    })
}

process.once('SIGUSR2', function() {
    gracefulShutdown('nodemon restart', function() {
        process.kill(process.pid, 'SIGUSR2')
    })
})

process.on('SIGINT', function() {
    gracefulShutdown('app termination', function() {
        process.exit(0)
    })
})

require('./models/schema.ZabbixCli')
require('./models/schema.Items')
require('./models/schema.Triggers')
require('./models/schema.Evets')
