const { Router } = require('express')
const { refresh } = require('../controllers/token.controller')
const router = new Router()

router.get('/api/token/refresh', refresh)

module.exports = router
