const fetchFunction = async(fetchOptions, data) => {
    const { method, url, redirectTo } = fetchOptions
    const allowedMethod = ['POST', 'PATCH', 'DELETE', 'post', 'patch', 'delete']
    if (allowedMethod.includes(method)) {
        const response = await fetch(
            url, {
                method: method.toUpperCase(),
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
        )
        if (response.status === 200) {
            window.location.href = redirectTo
        } else {
            alert("????")
        }
    } else {
        console.log('Method not allowed')
    }
}

const editTasks = async(element, target) => {
    const userId = element.getAttribute('data-user-id')
    let body = undefined
    let redirectTo = ''
    let url = ''
    let method = ''
    let flag = 1
    switch (target) {
        case 'boardName':
            {
                const newBoardName = document.getElementById(`oldBoardName_${userId}`).value
                const oldBoardName = element.getAttribute('data-old')
                redirectTo = `http://localhost:3000/my-tasks-by/?boardName=${newBoardName}`
                body = {
                    oldBoardName,
                    newBoardName
                }
                method = 'post'
                url = 'http://localhost:3000/edit/tasks/boardName'
                flag = 0
                break;
            }

        case 'collectionName':
            {
                flag = 0
                const oldCollectionName = element.getAttribute('data-old')
                const newCollectionName = document.getElementById(`${oldCollectionName}_${userId}`).value
                const newBoardName = document.getElementById(`oldBoardName_${userId}`).value
                redirectTo = `http://localhost:3000/my-tasks-by/?boardName=${newBoardName}`
                url = 'http://localhost:3000/edit/tasks/collectionName'
                method = 'post'
                body = { oldCollectionName, newCollectionName, newBoardName }
                break;
            }
        case 'description':
            {
                flag = 0
                const newBoardName = document.getElementById(`oldBoardName_${userId}`).value
                let collectionName = element.getAttribute('data-collection-name')
                collectionName = document.getElementById(`${collectionName}_${userId}`).value
                const taskId = element.getAttribute('data-task-id')
                const completed = document.getElementById(`completed_${taskId}`).checked
                const description = document.getElementById(`oldDescription_${taskId}`).value
                body = {
                    collectionName,
                    taskId,
                    completed,
                    description
                }
                url = 'http://localhost:3000/edit/tasks/description'
                method = 'post'
                redirectTo = `http://localhost:3000/my-tasks-by/?boardName=${newBoardName}`
                break;
            }
        default:
            flag = 1
            break;
    }
    if (flag === 1) {
        window.location.href = 'http://localhost:3000/my-tasks'
    } else
        await fetchFunction({
            url,
            method,
            redirectTo
        }, body)
}

const deleteTasks = async(element, target) => {
    const userId = element.getAttribute('data-user-id')
    let body = undefined
    let redirectTo = ''
    let url = ''
    let method = ''
    let flag = 1
    switch (target) {
        case 'boardName':
            {
                const boardName = document.getElementById(`oldBoardName_${userId}`).value
                body = {
                    boardName
                }
                url = `http://localhost:3000/edit/tasks/boardName`
                method = 'delete'
                redirectTo = 'http://localhost:3000/my-tasks'
                flag = 0
                break;
            }

        case 'collectionName':
            {
                const newBoardName = document.getElementById(`oldBoardName_${userId}`).value
                const collectionName = element.getAttribute('data-old')
                body = {
                    newBoardName,
                    collectionName
                }

                url = `http://localhost:3000/edit/tasks/collectionName`
                method = 'delete'
                redirectTo = `http://localhost:3000/my-tasks`
                flag = 0
                break;
            }
        case 'description':
            {
                flag = 0
                const newBoardName = document.getElementById(`oldBoardName_${userId}`).value
                const taskId = element.getAttribute('data-task-id')
                body = {
                    _id: taskId
                }
                url = 'http://localhost:3000/edit/tasks/delete'
                method = 'delete'
                redirectTo = `http://localhost:3000/my-tasks-by/?boardName=${newBoardName}`
                break;
            }
        default:
            flag = 1
            break;
    }

    if (flag === 1) {
        window.location.href = 'http://localhost:3000/my-tasks'
    } else
        await fetchFunction({
            url,
            method,
            redirectTo
        }, body)
}