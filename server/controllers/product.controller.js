const fs = require('fs')
const path = require('path')
const uploadImage = require('../utils/uploadImage')
const Product = require('../models/product.model')

module.exports.load = async (req, res) => {
  try {
    const products = await Product.findAll({ order: [['createdAt', 'DESC']] })
    const host = `${req.protocol}://${req.headers.host}`
    products.forEach(product => {
      product.image = product.image ? `${host}/uploads/${product.image}` : `${host}/uploads/default-product-image.jpg`
    })
    res.json({ success: true, data: products })
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.loadById = async (req, res) => {
  try {
    const product = await Product.findOne({ where: { id: req.params.id || null } })
    if (product) {
      const host = `${req.protocol}://${req.headers.host}`
      product.image = product.image ? `${host}/uploads/${product.image}` : `${host}/uploads/default-product-image.jpg`
      res.json({ success: true, data: product })
    } else {
      res.status(404).json({ success: false, frontMessage: 'Товар не найден' })
    }
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.create = async (req, res) => {
  try {
    const createObj = req.body
    createObj.image = ''
    if (req.files && req.files.image) {
      createObj.image = await uploadImage(req.files.image)
    }
    const result = await Product.create(createObj)
    result ? res.json({ success: true }) : res.json({ success: false })
  } catch (e) {
    res.status(500).json(e)
    console.log(e)
  }
}

module.exports.update = async (req, res) => {
  try {
    const updateObj = req.body
    const product = await Product.findOne({ where: { id: req.params.id || null } })
    if (product) {
      if (req.files && req.files.image) {
        if (product.image) {
          fs.unlinkSync(path.resolve(__dirname, '../uploads/', product.image))
        }
        updateObj.image = await uploadImage(req.files.image)
      }
      const result = await Product.update(updateObj, { where: { id: req.params.id || null } })
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
    const product = await Product.findOne({ where: { id: req.params.id || null } })
    if (product) {
      if (product.image) {
        fs.unlinkSync(path.resolve(__dirname, '../uploads/', product.image))
      }
      const result = await Product.destroy({ where: { id: req.params.id || null } })
      result ? res.json({ success: true }) : res.json({ success: false })
    } else {
      res.json({ success: false })
    }
  } catch (e) {
    res.status(500).json(e)
    console.log(e)
  }
}

