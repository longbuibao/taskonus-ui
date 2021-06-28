const mongoose = require('mongoose')
    // const uri = `${process.env.DB_HOST}://${process.env.DB_USER}:${process.env.DB_PASS}@task-manager-api.zxm58.mongodb.net/task-manager-api?retryWrites=true&w=majority`
const uri = 'mongodb://localhost:27017/task-api-dev'
mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(res => console.log('Database for token: OK 👍'))
    .catch(e => console.log(e))