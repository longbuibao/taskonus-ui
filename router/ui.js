const express = require('express')
const router = new express.Router()

router.get('/ui/index', (_, res) => {
    res.render('partials/header')
})

router.get('/ui/login', (_, res) => {
    res.render('login')
})

router.get('/ui/user', (_, res) => {
    res.render('user')
})

router.get('/ui/tasks', (_, res) => {
    res.render('mytasks')
})

module.exports = router