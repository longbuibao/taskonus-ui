const express = require('express')
const app = express()
const ui = require('./router/ui')

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(ui)

app.listen(3001)