const express = require('express')
const path = require('path')
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')

const uiRouter = require('./router/ui')

app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(express.static(path.join(__dirname, '/public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(cookieParser())
app.use(cors({ origin: true, credentials: true }))


app.use(uiRouter)

app.listen(3000)