const { DataTypes, Model } = require('sequelize')
const db = require('../db')
const User = require('./user.model')

class Token extends Model {}

Token.init({
  token: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  expires: {
    type: DataTypes.BIGINT,
    defaultValue: 0
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    }
  }
}, {
  sequelize: db,
  modelName: 'Token',
  tableName: 'token',
})

module.exports = Token
