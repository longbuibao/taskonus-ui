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
    const result = tasks.reduce((acc, cur, index) => {
        const { collectionName, description } = cur
        if (acc[collectionName]) {
            acc[collectionName] = [...acc[collectionName], description]
        } else {
            acc[collectionName] = [description]
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