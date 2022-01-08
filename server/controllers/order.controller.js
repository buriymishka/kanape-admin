const Order = require('../models/order.model')

module.exports.load = async (req, res) => {
  try {
    const orders = await Order.findAll({ order: [['createdAt', 'DESC']] })
    res.json({ success: true, data: orders })
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.loadById = async (req, res) => {
  try {
    const order = await Order.findOne({ where: { id: req.params.id || null } })
    if (order) {
      res.json({ success: true, data: order })
    } else {
      res.status(404).json({ success: false, frontMessage: 'Заказ не найдена' })
    }
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.create = async (req, res) => {
  try {
    const result = await Order.create(req.body)
    result ? res.json({ success: true }) : res.json({ success: false })
  } catch (e) {
    res.status(500).json(e)
    console.log(e)
  }
}

module.exports.update = async (req, res) => {
  try {
    const order = await Order.findOne({ where: { id: req.params.id || null } })
    if (order) {
      const result = await Order.update(req.body, { where: { id: req.params.id || null } })
      result ? res.json({ success: true }) : res.json({ success: false })
    } else {
      res.json({ success: false })
    }
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.changeStatus = async (req, res) => {
  try {
    const order = await Order.findOne({ where: { id: req.params.id || null } })
    if (order) {
      const result = await Order.update({ status: req.body.status || '' }, { where: { id: req.params.id || null } })
      result ? res.json({ success: true }) : res.json({ success: false })
    } else {
      res.json({ success: false })
    }
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.remove = async (req, res) => {

  try {
    const order = await Order.findOne({ where: { id: req.params.id || null } })
    if (order) {
      const result = await Order.destroy({ where: { id: req.params.id || null } })
      result ? res.json({ success: true }) : res.json({ success: false })
    } else {
      res.json({ success: false })
    }
  } catch (e) {
    res.status(500).json(e)
    console.log(e)
  }
}

