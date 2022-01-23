const fs = require('fs')
const path = require('path')
const uploadImage = require('../utils/uploadImage')
const Category = require('../models/category.model')

module.exports.load = async (req, res) => {
  try {
    console.log(req.query)
    const categories = await Category.findAll({ order: [[req.query.orderBy || 'createdAt', req.query.orderSort || 'DESC']] })
    const host = `${req.protocol}://${req.headers.host}`
    categories.forEach(category => {
      category.image = category.image ? `${host}/uploads/${category.image}` : `${host}/uploads/default-category-image.jpg`
    })
    res.json({ success: true, data: categories })
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.loadById = async (req, res) => {
  try {
    const category = await Category.findOne({ where: { id: req.params.id || null } })
    if (category) {
      const host = `${req.protocol}://${req.headers.host}`
      category.image = category.image ? `${host}/uploads/${category.image}` : `${host}/uploads/default-category-image.jpg`
      res.json({ success: true, data: category })
    } else {
      res.status(404).json({ success: false, frontMessage: 'Категория не найдена' })
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
    const result = await Category.create(createObj)
    result ? res.json({ success: true }) : res.json({ success: false })
  } catch (e) {
    res.status(500).json(e)
    console.log(e)
  }
}

module.exports.update = async (req, res) => {
  try {
    const updateObj = req.body
    const category = await Category.findOne({ where: { id: req.params.id || null } })
    if (category) {
      if (req.files && req.files.image) {
        if (category.image) {
          try {
            fs.unlinkSync(path.resolve(__dirname, '../uploads/', category.image))
          } catch (e) {} 
        }
        updateObj.image = await uploadImage(req.files.image)
      }
      const result = await Category.update(updateObj, { where: { id: req.params.id || null } })
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
    const category = await Category.findOne({ where: { id: req.params.id || null } })
    if (category) {
      if (category.image) {
        try {
          fs.unlinkSync(path.resolve(__dirname, '../uploads/', category.image))
        } catch (e) {} 
      }
      const result = await Category.destroy({ where: { id: req.params.id || null } })
      result ? res.json({ success: true }) : res.json({ success: false })
    } else {
      res.json({ success: false })
    }
  } catch (e) {
    res.status(500).json(e)
    console.log(e)
  }
}

