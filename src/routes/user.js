const express = require('express')
const { menu, register, login, getProfile, createOrder, updateProfile, productDetail } = require('../app/controllers/userController')
const router = express.Router()

router.get('/menu,', menu)
router.get('/product-detail/:id', productDetail)
router.post('/register',  register)
router.post('/login', login)
router.get('/profile/:id', getProfile)
router.post('create-order', createOrder)
router.put('update-profile/:id', updateProfile)

module.exports = router