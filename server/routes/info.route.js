const { Router } = require('express')
const auth = require('../middleware/auth')
const { load, update } = require('../controllers/info.controller')
const router = new Router()

router.get('/api/info', auth, load)

router.put('/api/info', auth, update)

module.exports = router
