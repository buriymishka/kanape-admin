const { Router } = require('express')
const auth = require('../middleware/auth')
const { create, update, load, remove, loadById } = require('../controllers/product.controller')
const router = new Router()

router.get('/api/product', auth, load)
router.get('/api/product/:id', auth, loadById)

router.post('/api/product', auth, create)

router.put('/api/product/:id', auth, update)

router.delete('/api/product/:id', auth, remove)

module.exports = router
