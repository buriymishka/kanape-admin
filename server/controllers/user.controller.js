const validator = require('validator')
const bcrypt = require('bcrypt')
const { getAccessTokenPayload, generateRefreshToken, generateAccessToken } = require('../utils/tokens')
const { createPassword, generatePassword, sendRecoverMail } = require('../utils/functions')
const { Op } = require('sequelize')
const db = require('../db')
const User = require('../models/user.model')
const Token = require('../models/token.model')

module.exports.login = async (req, res) => {
  try {
    const user = await User.findByEmail(req.body.email)
    if (user) {
      const isPassCorrect = await bcrypt.compare(req.body.password, user.password)
      if (isPassCorrect) {
        const generatedRefreshToken = generateRefreshToken()
        await Token.create({ token: generatedRefreshToken, userId: user.id, expires: Date.now() + (1000 * 60 * 60 * 24 * 30)})
        res.cookie('refreshToken', generatedRefreshToken, { maxAge: 2592000000, httpOnly: true });
        const generatedAccessToken = generateAccessToken({ id: user.id })

        res.json({ success: true, data: { name: user.name, email: user.email, accessToken: generatedAccessToken } })
      } else {
        res.status(404).json({ frontMessage: 'Неверный Email или пароль' })
      }
    } else {
      res.status(404).json({ frontMessage: 'Неверный Email или пароль' })
    }
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.load = async (req, res) => {
  let token = getAccessTokenPayload(req.headers['accesstoken'])

  try {
    const user = await User.findById(token.id, ['email'])
    if (user) {
      res.json({ success: true, data: user })
    } else {
      res.status(404).json({ frontMessage: 'Ошибка' })
    }
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.registration = async (req, res) => {
  try {
    if (!validator.isEmail(req.body.email)) return res.status(400).json({ frontMessage: 'Невалидный Email' })
    if (!req.body.password) return res.status(400).json({ frontMessage: 'Введите Пароль' })
    if (req.body.password?.length < 4) return res.status(400).json({ frontMessage: 'Пароль должен состоять минимум из 4 символов' })
    if (req.body.password?.includes(' ')) return res.status(400).json({ frontMessage: 'Пароль не может содержать пробелов' })

    const userByEmail = await User.findByEmail(req.body.email)
    if (userByEmail) return res.status(409).json({ frontMessage: 'Email уже занят' })

    const newUser = await User.create({
      email: req.body.email,
      password: createPassword(req.body.password),
    })

    const generatedRefreshToken = generateRefreshToken()
    await Token.create({ token: generatedRefreshToken, userId: newUser.id, expires: Date.now() + (1000 * 60 * 60 * 24 * 30)})
    res.cookie('refreshToken', generatedRefreshToken, { maxAge: 2592000000, httpOnly: true });
    const generatedAccessToken = generateAccessToken({ id: newUser.id })

    res.json({ success: true, data: { email: newUser.email, accessToken: generatedAccessToken } })
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.update = async (req, res) => {
  if (!validator.isEmail(req.body.email)) return res.status(400).json({ frontMessage: 'Невалидный Email' })
  if (req.body.newPassword && req.body.newPassword?.length < 4) return res.status(400).json({ frontMessage: 'Пароль должен состоять минимум из 4 символов' })
  if (req.body.newPassword && req.body.newPassword?.includes(' ')) return res.status(400).json({ frontMessage: 'Пароль не может содержать пробелов' })

  const token = getAccessTokenPayload(req.headers['accesstoken'])
  try {
    const userByEmail = await User.findOne({
      where: {
        email: req.body.email,
        id: { [Op.not]: token.id }
      }
    })
    if (userByEmail) return res.status(409).json({ frontMessage: 'Email уже занят' })
    const dataForUpdate = {
      email: req.body.email,
    }
    if (req.body.newPassword) {
      dataForUpdate.password = createPassword(req.body.newPassword)
    }

    const newUser = await User.update(dataForUpdate, { where: { id: token.id }, returning: ['email'] })
    res.json({ success: true, data: newUser?.[1]?.[0] })
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.recover = async (req, res) => {
  try {
    const user = await User.findByEmail(req.body.email)
    if (user) {
      const newPasswordPlain = generatePassword()
      const newPasswordHash = createPassword(newPasswordPlain)
      await sendRecoverMail(req.body.email, newPasswordPlain)
      await User.update({ password: newPasswordHash }, { where: { id: user.id } })
      res.json({ success: true })
    } else {
      res.status(404).json({ frontMessage: 'Пользователь с таким Email не найден' })
    }
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.logout = async (req, res) => {
  try {
    res.clearCookie('refreshToken')
    await Token.destroy({ where: { token: req.cookies.refreshToken } })
    res.json({ success: true })
  } catch (e) {
    res.status(500).json(e)
  }
}
