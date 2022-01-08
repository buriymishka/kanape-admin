const Category = require('./category.model')
const { DataTypes, Model } = require('sequelize')
const db = require('../db')

class Product extends Model {}

Product.init({
  title_ru: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  title_lv: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  title_en: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  image: {
    type: DataTypes.STRING(2048),
    defaultValue: ''
  },
  order: {
    type: DataTypes.BIGINT,
    defaultValue: 0
  },
  description_ru: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  description_lv: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  description_en: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  price: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  categoryId: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize: db,
  modelName: 'Product',
  tableName: 'product',
})

module.exports = Product
