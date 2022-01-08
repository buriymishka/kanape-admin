const { DataTypes, Model } = require('sequelize')
const db = require('../db')

class Order extends Model {}

Order.init({
  name: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  languageId: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  payTypeId: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  phone: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  sum: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  comment: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  payStatus: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  products: {
    type: DataTypes.JSON,
    defaultValue: []
  },
}, {
  sequelize: db,
  modelName: 'Order',
  tableName: 'order',
})

module.exports = Order
