const express = require('express')
const path = require('path')
const app = express()

const uiRouter = require('./router/ui')

app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(express.static(path.join(__dirname, '/public')))


app.use(uiRouter)

app.listen(3001)