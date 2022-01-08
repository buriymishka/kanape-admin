const { DataTypes, Model } = require('sequelize')
const db = require('../db')

class Info extends Model {}

Info.init({
  phone: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  address: {
    type: DataTypes.STRING(2048),
    defaultValue: ''
  }
}, {
  sequelize: db,
  modelName: 'Info',
  tableName: 'info',
})

module.exports = Info
