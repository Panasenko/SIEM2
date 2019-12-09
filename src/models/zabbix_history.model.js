const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient')

  const zabbixHistory = sequelizeClient.define('history_zabbix', {
    id_item: {
      type: DataTypes.STRING,
      allowNull: false
    },
    itemid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    clock: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ns: {
      type: DataTypes.STRING,
      allowNull: false
    },
    units: {
      type: DataTypes.STRING,
      allowNull: false
    },

  }, {
    timestamps: false,
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  })

  zabbixHistory.associate = function (models) {}

  return zabbixHistory;
};
