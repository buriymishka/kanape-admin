const { Router } = require('express')
const auth = require('../middleware/auth')
const { create, update, load, remove, loadById } = require('../controllers/category.controller')
const router = new Router()

router.get('/api/category', auth, load)
router.get('/api/category/:id', auth, loadById)

router.post('/api/category', auth, create)

router.put('/api/category/:id', auth, update)

router.delete('/api/category/:id', auth, remove)

module.exports = router
