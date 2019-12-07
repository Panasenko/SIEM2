const Sequelize = require('sequelize');

module.exports = function (app) {

  const {db_name, db_login, db_password, config} = app.get('postgres')

  const sequelize = new Sequelize(db_name, db_login, db_password, config)

  const oldSetup = app.setup

  app.set('sequelizeClient', sequelize);

  app.setup = function (...args) {
    const result = oldSetup.apply(this, args);

    const models = sequelize.models;
    Object.keys(models).forEach(name => {
      if ('associate' in models[name]) {
        models[name].associate(models);
      }
    });

    // Sync to the database
    app.set('sequelizeSync', sequelize.sync());

    return result;
  };
};
