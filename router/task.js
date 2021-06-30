const express = require('express')
const axios = require('axios').default
const router = new express.Router()
const taskUtils = require('../utils/filter-task')
const getUserAvatar = require('../utils/get-user-avatar')
const url = 'http://localhost:8000/'

router.post('/tasks/create', async(req, res) => {
    const taskData = {
        ...req.body
    }
    const config = {
        headers: {
            Authorization: `Bearer ${req.cookies.authtoken}`
        }
    }
    try {
        const response = await axios.post(
            `${url}tasks`,
            taskData,
            config
        )
        if (response.status === 201) {
            res.redirect(`/my-tasks-by/?boardName=${taskData.boardName}`)
        }
    } catch (error) {
        res.render('error-something-wrong', {
            data: {
                message: error.message
            }
        })
    }
})

router.get('/my-tasks-by', async(req, res) => {
    const { boardName } = req.query
    const config = {
        headers: {
            Authorization: `Bearer ${req.cookies.authtoken}`
        }
    }
    console.log(url + `tasks/?boardName=${boardName}`)
    const tasksByBoardName = await axios.get(
        url + `tasks/?boardName=${boardName}`,
        config
    )


    const { tasks, username, _id } = tasksByBoardName.data


    let avatar = await getUserAvatar(_id)

    const finalAvatar = avatar.data.data ? Buffer.from(avatar.data.data).toString('base64') : ''

    console.log('hello')

    if (tasks.length === 0) {
        res.render('noTask', { data: { username, finalAvatar } })
    } else {
        const allTasks = await axios.get(
            url + 'tasks',
            config
        )
        const boardAndCollection = taskUtils.getBoardNameAndCollectionName(allTasks.data.tasks)
        const tasksByBoardName = taskUtils.getTasksByBoardName(tasks, boardName)
        const ISOTime = new Date(tasksByBoardName[0].createdAt)
        const tasksFrom = taskUtils.tasksInCollection(tasksByBoardName)

        const data = {
            boardName,
            tasksFrom
        };

        res.render('detailTask', {
            boardAndCollection,
            time: ISOTime,
            data,
            username,
            finalAvatar
        })


    }
})

module.exports = router