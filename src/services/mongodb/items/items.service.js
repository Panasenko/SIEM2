// Initializes the `items` service on path `/items`
const { ItemsDB } = require('./items.class');
const createModel = require('../../../models/mongo_db/items.model');
const hooks = require('./items.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    multi: true
  };

  // Initialize our service with any options it requires
  app.use('/itemsDB', new ItemsDB(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('itemsDB');

  service.hooks(hooks);
};
