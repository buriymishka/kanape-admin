const { DataTypes, Model } = require('sequelize')
const db = require('../db')

class Category extends Model {}

Category.init({
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
  }
}, {
  sequelize: db,
  modelName: 'Category',
  tableName: 'category',
})

module.exports = Category
