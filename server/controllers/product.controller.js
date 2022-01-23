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
      if (product.imageAdditional && product.imageAdditional.length) {
        product.imageAdditional = product.imageAdditional.map(img => `${host}/uploads/${img}`)
      }
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
      if (product.imageAdditional && product.imageAdditional.length) {
        product.imageAdditional = product.imageAdditional.map(img => `${host}/uploads/${img}`)
      }
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

    createObj.imageAdditional = []
    if (req.files.imageAdditional && req.files.imageAdditional.length) {
      for (let i = 0; i < req.files.imageAdditional.length; i++) {
        let imgAddName = await uploadImage(req.files.imageAdditional[i])
        createObj.imageAdditional.push(imgAddName)
      }
    }
    console.log(createObj)
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
          try {
            fs.unlinkSync(path.resolve(__dirname, '../uploads/', product.image))
          } catch (e) {} 
        }
        updateObj.image = await uploadImage(req.files.image)
      }
      updateObj.imageAdditional = product.imageAdditional || []

      try {
        updateObj.imageAdditionalDelete = JSON.parse(updateObj.imageAdditionalDelete)
      } catch (e) {}
      if (updateObj.imageAdditionalDelete && updateObj.imageAdditionalDelete.length && Array.isArray(updateObj.imageAdditionalDelete)) {
        updateObj.imageAdditionalDelete = updateObj.imageAdditionalDelete.map(el => path.basename(el))
        updateObj.imageAdditionalDelete.forEach(file => {
          try {
            fs.unlinkSync(path.resolve(__dirname, '../uploads/', file))
          } catch (e) {}
        })
        updateObj.imageAdditional = updateObj.imageAdditional.filter(el => !updateObj.imageAdditionalDelete.includes(path.basename(el)))
      }
      delete updateObj.imageAdditionalDelete
      
      if (req.files && req.files.imageAdditional && req.files.imageAdditional.length) {
        for (let i = 0; i < req.files.imageAdditional.length; i++) {
          let imgAddName = await uploadImage(req.files.imageAdditional[i])
          updateObj.imageAdditional.push(imgAddName)
        }
      }

      const result = await Product.update(updateObj, { where: { id: req.params.id || null } })
      result ? res.json({ success: true }) : res.json({ success: false })
    } else {
      res.json({ success: false })
    }
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}

module.exports.remove = async (req, res) => {

  try {
    const product = await Product.findOne({ where: { id: req.params.id || null } })
    if (product) {
      if (product.image) {
        try {
          fs.unlinkSync(path.resolve(__dirname, '../uploads/', product.image))
        } catch (e) {} 
      }
      if (product.imageAdditional && product.imageAdditional.length) {
        product.imageAdditional.forEach(file => {
          try {
            fs.unlinkSync(path.resolve(__dirname, '../uploads/', file))
          } catch (e) {} 
        })
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

