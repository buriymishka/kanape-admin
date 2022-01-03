const { DataTypes, Model } = require('sequelize')
const db = require('../db')

class User extends Model {}

User.init({
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'standard'
  }
}, {
  sequelize: db,
  modelName: 'User',
  tableName: 'user',
})

User.findById = async (id = 0, attributes) => {
  return await User.findOne({ where: { id }, attributes })
}

User.findByEmail = async (email = '', attributes) => {
  return await User.findOne({ where: { email }, attributes })
}

module.exports = User
