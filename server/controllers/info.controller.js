const Info = require('../models/info.model')

module.exports.load = async (req, res) => {
  try {
    const info = await Info.findOne()
    if (!info) return res.json({ success: false })
    res.json({ success: true, data: info })
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.update = async (req, res) => {
  try {
    let info = await Info.findOne()
    if (info) {
      await Info.update(req.body, { where: { id: info.id } })
    } else {
      await Info.create(req.body)
    }

    res.json({ success: true })
  } catch (e) {
    res.status(500).json(e)
  }
}
