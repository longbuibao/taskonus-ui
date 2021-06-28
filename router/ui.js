const express = require('express')
const router = new express.Router()
const axios = require('axios').default
const taskUtils = require('../utils/filter-task')
    //render login and register page
router.get('/ui/login', (_, res) => {
    res.render('login')
})

//try to login to localhost:8000
router.post('/users/login', async(req, res) => {
    const { email, password } = req.body
    axios.defaults.withCredentials = true
    try {
        const response = await axios.post(
            'http://localhost:8000/users/login', {
                email,
                password
            })
        if (response.status === 200) {
            res.cookie('authtoken', response.data.token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            })
            res.redirect('/my-tasks')
        } else {
            throw new Error('Không thể đăng nhập')
        }
    } catch (error) {
        res.render('error-something-wrong', {
            data: {
                message: error.message
            }
        })
    }

});
//try to register in localhost:8000
router.post('/users', async(req, res) => {
    const { name, email, password } = req.body
    axios.defaults.withCredentials = true
    try {
        const response = await axios.post(
            'http://localhost:8000/users', {
                name,
                email,
                password
            }
        )

        if (response.status === 201) {
            res.redirect('/ui/login')
        } else {
            throw new Error('Không thể tạo tài khoản')
        }
    } catch (error) {
        res.render('error-something-wrong', {
            data: {
                message: error.message
            }
        })
    }
})

router.get('/my-tasks', async(req, res) => {
    const config = {
        headers: {
            Authorization: `Bearer ${req.cookies.authtoken}`
        }
    }
    try {
        const response = await axios.get(
            'http://localhost:8000/tasks',
            config
        )
        const { tasks, username } = response.data

        if (tasks.length === 0) {
            res.render('noTask')
        } else {
            const index = 0
                //lấy tất cả tên board và collection
            const boardAndCollection = taskUtils.getBoardNameAndCollectionName(tasks)
                //lấy hêt tất cả tasks bằng board name
            const tasksByBoardName = taskUtils.getTasksByBoardName(tasks, boardAndCollection.boardName[index])
                //tao time
            const ISOTime = new Date(tasksByBoardName[index].createdAt)
                //lay het tat ca tasks trong collection name
            const tasksFrom = taskUtils.tasksInCollection(tasksByBoardName)

            console.log(tasksFrom)

            const data = {
                boardName: boardAndCollection.boardName[index],
                tasksFrom
            };

            res.render('detailTask', {
                boardAndCollection,
                time: ISOTime,
                data,
                username
            })
        }
    } catch (error) {
        res.render('error-something-wrong', {
            data: { message: error.message }
        })
    }
})

router.get('/users/logout', async(req, res) => {
    const config = {
        headers: {
            Authorization: `Bearer ${req.cookies.authtoken}`
        }
    }
    try {
        const response = await axios.post(
            'http://localhost:8000/users/logout',
            config
        )
        if (response.status === 200) {
            res.render('error-something-wrong', {
                data: {
                    message: response.data.message
                }
            })
        }
    } catch (error) {

    }


})


router.get('/test', (req, res) => {
    res.render('detailTask')
})

module.exports = router