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
    const { boardName, sortBy, completed } = req.query
    let newUrl = url
    let isSelected = ''
    if (!sortBy && !completed) {
        newUrl += `tasks/?boardName=${boardName}`
        isSelected = {
            data: 0
        }
    }

    if (sortBy) {
        newUrl += `tasks/?boardName=${boardName}&sortBy=${sortBy}`
        const parts = sortBy.split(':')
        isSelected = {
            data: parts[1] === 'desc' ? '3' : '2'
        }
    }

    if (completed) {
        newUrl += `tasks/?boardName=${boardName}&completed=${completed}`
        isSelected = {
            data: 1
        }
    }


    console.log(newUrl)

    const config = {
        headers: {
            Authorization: `Bearer ${req.cookies.authtoken}`
        }
    }
    const tasksByBoardName = await axios.get(
        newUrl,
        config
    )

    const { tasks, username, _id } = tasksByBoardName.data

    let avatar = await getUserAvatar(_id)

    const finalAvatar = avatar.data.data ? Buffer.from(avatar.data.data).toString('base64') : ''

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
            finalAvatar,
            _id,
            isSelected
        })
    }
})


// ================================edit and delete route===============

router.post('/edit/tasks/boardName', async(req, res) => {
    const { oldBoardName, newBoardName } = req.body
    const config = {
        headers: {
            Authorization: `Bearer ${req.cookies.authtoken}`
        }
    }
    const response = await axios.get(
        url + `tasks/?boardName=${oldBoardName}`,
        config
    )

    if (response.status === 200) {
        const patchBoardName = await axios.patch(
            url + 'edit/boardName', { newBoardName, oldBoardName },
            config
        )

        if (patchBoardName.status === 200) {
            res.status(200).send()
        } else {
            res.status(500).send()
        }
    } else res.status(400).send()
})

router.delete('/edit/tasks/boardName', async(req, res) => {
    const { boardName } = req.body

    const config = {
        headers: {
            Authorization: `Bearer ${req.cookies.authtoken}`
        }
    }
    const response = await axios.delete(
        url + `edit/tasks/boardName/?boardName=${boardName}`,
        config
    )
    if (response.status === 200) {
        res.status(200).send()
    } else {
        res.status(400).send()
    }
})

router.post('/edit/tasks/collectionName', async(req, res) => {
    const { oldCollectionName, newCollectionName, newBoardName } = req.body
    const config = {
        headers: {
            Authorization: `Bearer ${req.cookies.authtoken}`
        }
    }
    const response = await axios.patch(
        url + `edit/tasks/collectionName/?collectionName=${oldCollectionName}`, { oldCollectionName, newCollectionName, newBoardName },
        config
    )
    if (response.status === 200) {
        res.status(200).send()
    } else res.status(400).send()
})

router.delete('/edit/tasks/collectionName', async(req, res) => {
    const { collectionName, newBoardName } = req.body
    const config = {
        headers: {
            Authorization: `Bearer ${req.cookies.authtoken}`
        }
    }

    const response = await axios.delete(
        url + `edit/tasks/collectionName/?collectionName=${collectionName}&boardName=${newBoardName}`,
        config
    )
    if (response.status === 200) {
        res.status(200).send()
    } else {
        res.status(400).send()
    }
})

router.post('/edit/tasks/description', async(req, res) => {
    const { taskId, ...body } = req.body

    const config = {
        headers: {
            Authorization: `Bearer ${req.cookies.authtoken}`
        }
    }

    const response = await axios.patch(
        url + `tasks/${taskId}`,
        body,
        config
    )

    if (response.status === 200) {
        res.status(200).send()
    } else res.status(400).send()
})

router.delete('/edit/tasks/delete', async(req, res) => {
    const { _id } = req.body
    const config = {
        headers: {
            Authorization: `Bearer ${req.cookies.authtoken}`
        }
    }
    const response = await axios.delete(
        url + `tasks/${_id}`,
        config
    )

    if (response.status === 200) {
        res.status(200).send()
    } else {
        res.status(400).send()
    }
})

router.get('/search/tasks', async(req, res) => {
    const { boardName } = req.query
    console.log(boardName)
    const config = {
        headers: {
            Authorization: `Bearer ${req.cookies.authtoken}`
        }
    }
    try {
        const allBoardName = await axios.get(
            url + `search/tasks/?boardName=${boardName}`,
            config
        )
        if (allBoardName.status === 200) {
            res.status(200).send(allBoardName.data)
        }
    } catch (error) {
        if (error) {
            res.status(404).send()
        }
    }
})

router.post('/search/display-result', async(req, res) => {
    console.log(req.body)
    res.render('main')
})

module.exports = router