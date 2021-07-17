const getBoardNameAndCollectionName = (tasks) => {
    const boardName = []
    const collectionName = []
    tasks.forEach(task => {
        boardName.push(task.boardName)
        collectionName.push(task.collectionName)
    })

    const uniqBoardName = [...new Set(boardName)]
    const uniqCollectionName = [...new Set(collectionName)]

    return {
        boardName: uniqBoardName,
        collectionName: uniqCollectionName
    }
}

const getTasksByBoardName = (tasks, boardName) => {
    return tasks.filter(task => {
        return task.boardName === boardName
    })
}

const tasksInCollection = (tasks) => {
    const result = tasks.reduce((acc, cur) => {
        const { collectionName, description, createdAt, completed, _id, deadline } = cur
        if (acc[collectionName]) {
            acc[collectionName] = [...acc[collectionName], { description, createdAt, completed, _id, deadline }]
        } else {
            acc[collectionName] = [{ description, createdAt, completed, _id, deadline }]
        }
        return acc
    }, {})
    return result
}

module.exports = {
    getBoardNameAndCollectionName,
    getTasksByBoardName,
    tasksInCollection
}