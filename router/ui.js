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

router.get('/ui/noTask', (_, res) => {
    res.render('noTask')
})

router.get('/ui/introPage', (_, res) => {
    res.render('introPage')
})

router.get('/ui/mytasks', (_, res) => {
    res.render('mytasks')
})

router.get('/ui/detailTask', (_, res) => {
    res.render('detailTask')
})

module.exports = router