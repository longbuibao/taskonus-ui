const express = require('express')
const router = new express.Router()
const axios = require('axios').default
const taskUtils = require('../utils/filter-task')
const multer = require('multer')
const sharp = require('sharp')
const getUserAvatar = require('../utils/get-user-avatar')
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
        const { tasks, username, _id } = response.data

        let avatar = await getUserAvatar(_id)

        const finalAvatar = avatar.data.data ? Buffer.from(avatar.data.data).toString('base64') : ''

        if (tasks.length === 0) {
            res.render('noTask', { data: { username, finalAvatar } })
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

            const data = {
                boardName: boardAndCollection.boardName[index],
                tasksFrom
            };
            const isSelected = {
                data: ''
            }
            res.render('detailTask', {
                boardAndCollection,
                time: ISOTime,
                data,
                username,
                finalAvatar,
                _id,
                isSelected
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
            null,
            config
        )
        if (response.status === 200) {
            res.redirect('/ui/login')
        }
    } catch (error) {
        res.render('error-something-wrong', {
            data: {
                message: error.message
            }
        })
    }
})

router.get('/users/logoutall', async(req, res) => {
    const config = {
        headers: {
            Authorization: `Bearer ${req.cookies.authtoken}`
        }
    }
    try {
        const response = await axios.post(
            'http://localhost:8000/users/logoutall',
            null,
            config
        )
        if (response.status === 200) {
            res.redirect('/ui/login')
        }
    } catch (error) {
        res.render('error-something-wrong', {
            data: {
                message: error.message
            }
        })
    }
})

router.get('/users/me', async(req, res) => {
    const config = {
        headers: {
            Authorization: `Bearer ${req.cookies.authtoken}`
        }
    }
    try {
        const response = await axios.get(
            'http://localhost:8000/users/me',
            config
        )
        const responseTasks = await axios.get(
            'http://localhost:8000/tasks',
            config
        )

        const tasks = responseTasks.data.tasks

        const boardAndCollection = taskUtils.getBoardNameAndCollectionName(tasks)

        const _id = response.data._id
        const avatar = await getUserAvatar(_id)

        const finalAvatar = avatar.data.data ? Buffer.from(avatar.data.data).toString('base64') : ''

        if (response.status === 200) {
            return res.render('user', {
                data: response.data,
                boardAndCollection,
                finalAvatar
            })
        } else {
            res.render('error-something-wrong', {
                data: {
                    message: 'ui.js ln 199'
                }
            })
        }
    } catch (error) {
        res.render('error-something-wrong', { data: { message: error.message } })
    }
})

router.post('/users/me/edit/password', async(req, res) => {
    const config = {
        headers: {
            Authorization: `Bearer ${req.cookies.authtoken}`
        }
    }
    const { currentPwd, newPwd } = req.body
    try {
        const response = await axios.post(
            'http://localhost:8000/check-old-password', { currentPwd },
            config
        )

        if (response.data.isMatch) {
            const response = await axios.patch(
                'http://localhost:8000/users/me', { password: newPwd },
                config
            )
            res.redirect('/users/me')
        }
    } catch (error) {
        res.render('error-something-wrong', {
            data: {
                message: error.message
            }
        })
    }
})

const upload = multer({
    limits: {
        fileSize: 5000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname) {
            return cb(new Error('Please select an image'))
        }
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
            return cb(new Error('File must be an image'))
        cb(undefined, true)
    }
});

router.post('/users/me/edit', upload.single('avatar'), async(req, res) => {
    const { name, email, password } = req.body
    const config = {
        headers: {
            Authorization: `Bearer ${req.cookies.authtoken}`
        },
        maxContentLength: 5000000,
        maxBodyLength: 5000000
    }

    const userToPatch = {
        ...(name !== undefined) && { name },
        ...(email !== undefined) && { email },
        ...(password !== undefined) && { password }
    }

    if (req.file) {
        try {
            const buffer = await sharp(req.file.buffer)
                .resize({ width: 150 })
                .toBuffer()
            req.file.buffer = buffer
            const file = req.file.buffer
            const data = {
                file: {
                    buffer: file
                },
                originalname: req.file.originalname
            }

            const uploadAvatar = await axios.post(
                'http://localhost:8000/users/me/avatar',
                data,
                config
            )
            if (uploadAvatar.status === 200) {
                return res.redirect('/users/me')
            } else {
                res.render('error-something-wrong', {
                    data: {
                        message: 'ui.js ln 290'
                    }
                })
            }
        } catch (e) {
            res.render('error-something-wrong', {
                data: {
                    message: e.message
                }
            })
        }
    }

    try {
        const response = await axios.patch(
            `http://localhost:8000/users/me`,
            userToPatch,
            config
        )

        if (response.status === 200) {
            res.redirect('/users/me')
        } else res.render('error-something-wrong', {
            data: { message: response.status }
        })
    } catch (error) {
        res.render('error-something-wrong', {
            data: { message: error.message }
        })
    }
})

router.get('/users/delete', async(req, res) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${req.cookies.authtoken}`
            }
        }
        const response = await axios.delete(
            'http://localhost:8000/users/me',
            config
        )
        if (response.status === 200) {
            res.redirect('/ui/login')
        }
    } catch (error) {

    }
})


router.get('/test', (req, res) => {
    res.render('user')
})

router.get('/deadline', (req, res) => {
    res.render('deadline')
})
router.get('/statis', (req, res) => {
    res.render('thongke')
})

module.exports = router