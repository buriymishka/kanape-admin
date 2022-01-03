const { Router } = require('express')
const auth = require('../middleware/auth')
const { login, registration, recover, load, update, logout } = require('../controllers/user.controller')
const router = new Router()

router.post('/api/user/login', login)

router.post('/api/user/registration', registration)

router.post('/api/user/recover', recover)

router.get('/api/user', auth, load)

router.put('/api/user', auth, update)

router.post('/api/user/logout', logout)

module.exports = router
