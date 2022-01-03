const db = require('../db')
const { generateAccessToken } = require('../utils/tokens')
const Token = require('../models/token.model')
const User = require('../models/user.model')

module.exports.refresh = async (req, res) => {
  try {
    const token = await Token.findOne({ where: { token: req.cookies.refreshToken || '' } })
    if (token) {
      let tokenDate = token.expires
      if (tokenDate > (Date.now() - 2000)) {

        const user = await User.findById(token.userId)
        if (user) {
          let AC = generateAccessToken({ id: user.id })
          await Token.update({ expires: Date.now() + (1000 * 60 * 60 * 24 * 30) }, { where: { token: req.cookies.refreshToken } })
          res.json({ success: true, newAccessToken: AC })
          return
        }

        res.json({ success: false })
        return
      }

      res.json({ success: false })
      return
    } else {
      res.json({ success: false })
    }
  } catch (e) {
    res.status(500).json(e)
  }
}
