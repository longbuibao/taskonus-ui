const express = require('express')
const router = new express.Router()

router.get('/ui/index', (_, res) => {
    res.render('partials/header')
})

router.get('/ui/login', (_, res) => {
    res.render('login')
})

module.exports = router