const { Router } = require('express')
const auth = require('../middleware/auth')
const { create, update, changeStatus, load, remove, loadById } = require('../controllers/order.controller')
const router = new Router()

router.get('/api/order', auth, load)
router.get('/api/order/:id', auth, loadById)

router.post('/api/order', auth, create)

router.put('/api/order/:id', auth, update)
router.put('/api/order/changeStatus/:id', auth, changeStatus)

router.delete('/api/order/:id', auth, remove)

module.exports = router
