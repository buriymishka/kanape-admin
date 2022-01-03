const { Sequelize } = require('sequelize')
const keys = require('./keys')

module.exports = new Sequelize(keys.DB_DATABASE, keys.DB_USER, keys.DB_PASSWORD, {
  host: keys.DB_HOST,
  port: keys.DB_PORT,
  dialect: 'postgres'
})
