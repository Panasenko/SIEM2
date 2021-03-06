const mongoose = require('mongoose')
//const logger = require('./logger')

module.exports = function (app) {
  const logger = app.get('logger')
  const mongoConf = app.get('mongodb')
  const urlConnect = `${mongoConf.url}:${mongoConf.port}/${mongoConf.collection}`

  mongoose.connect(urlConnect ,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    }
  ).catch(err => {
    app.get('logger').error(err);
    process.exit(1);
  })

  mongoose.connection.on('connected', function() {
    app.get('logger').log({
      level: 'info',
      label: 'connected MongoDB',
      message: `Mongoose connected to ${urlConnect}`
    })
  })

  mongoose.connection.on('error', function(err) {
    app.get('logger').log({
      level: 'error',
      label: 'connected MongoDB',
      message: `Mongoose connection error ${err}`
    })
  })

  mongoose.connection.on('disconnected', function() {
    app.get('logger').log('Mongoose disconnected')
  })

  let gracefulShutdown = function(msg, callback) {
    mongoose.connection.close(function() {
      app.get('logger').log({
        level: 'info',
        label: 'connection close',
        message: `Mongoose disconnected through ${msg}`
      })
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

  mongoose.Promise = global.Promise

  app.set('mongooseClient', mongoose)
}
