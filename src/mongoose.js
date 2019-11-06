const mongoose = require('mongoose')
const logger = require('./logger')

module.exports = function (app) {
  mongoose.connect(
    app.get('mongodb'),
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    }
  ).catch(err => {
    logger.error(err);
    process.exit(1);
  })

  mongoose.Promise = global.Promise

  app.set('mongooseClient', mongoose)
}

require('./database/models/schema.ZabbixCli')
require('./database/models/schema.Items')
require('./database/models/schema.Triggers')
require('./database/models/schema.Evets')
