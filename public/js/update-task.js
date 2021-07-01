const oldBoardName = document.getElementById('oldBoardName').value
const oldCollectionName = document.getElementById('oldCollectionName').value
const oldDescription = document.getElementById('oldDescription').value
const oldCompleted = document.getElementById('completed').checked

const boardNameEdit = document.getElementById('boardNameEdit')
const boardNameDelete = document.getElementById('boardNameDelete')

const editCollectionName = document.getElementById('editCollectionName')
const deleteCollectionName = document.getElementById('deleteCollectionName')

const editDescription = document.getElementById('editDescription')
const deleteDescription = document.getElementById('deleteDescription')


const fetchFunction = async(info) => {
    const { method, body, message, url, redirectTo } = info
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
                body: JSON.stringify(body)
            }
        )
        if (response.status === 200) {
            window.location.href = redirectTo
        } else {
            alert(message)
        }
    } else {
        console.log('Method not allowed')
    }
}


boardNameEdit.addEventListener('click', async() => {
    const newBoardName = document.getElementById('oldBoardName').value
    const body = {
        oldBoardName,
        newBoardName
    }

    await fetchFunction({
        url: `http://localhost:3000/edit/tasks/boardName`,
        method: 'POST',
        body,
        message: 'Không thể sửa bảng, vui lòng thử lại',
        redirectTo: `http://localhost:3000/my-tasks-by/?boardName=${newBoardName}`
    })

})

boardNameDelete.addEventListener('click', async() => {
    const boardName = document.getElementById('oldBoardName').value
    const body = {
        boardName
    }
    await fetchFunction({
        url: `http://localhost:3000/edit/tasks/boardName`,
        method: 'delete',
        body,
        message: 'Không thể xóa bảng, vui lòng thử lại',
        redirectTo: 'http://localhost:3000/my-tasks'
    })
})

editCollectionName.addEventListener('click', async() => {
    const newBoardName = document.getElementById('oldBoardName').value
    const newCollectionName = document.getElementById('oldCollectionName').value
    const body = {
        newCollectionName,
        oldCollectionName,
        newBoardName
    }

    await fetchFunction({
            url: 'http://localhost:3000/edit/tasks/collectionName',
            method: 'post',
            body,
            message: 'Không thể đổi tên thư mục, thử lại sau',
            redirectTo: `http://localhost:3000/my-tasks-by/?boardName=${newBoardName}`
        }

    )
})

deleteCollectionName.addEventListener('click', async() => {
    const collectionName = document.getElementById('oldCollectionName').value
    const newBoardName = document.getElementById('oldBoardName').value

    const body = {
        collectionName,
        newBoardName
    }
    console.log(body)
    await fetchFunction({
        url: 'http://localhost:3000/edit/tasks/collectionName',
        method: 'delete',
        body,
        message: 'Xóa tên thư mục thành công',
        redirectTo: 'http://localhost:3000/my-tasks'
    })
})

editDescription.addEventListener('click', async() => {
    const boardName = document.getElementById('oldBoardName').value
    const collectionName = document.getElementById('oldCollectionName').value
    const newCompleted = document.getElementById('completed').checked
    const newDescription = document.getElementById('oldDescription').value

    const body = {
        oldData: {
            oldDescription,
            oldCompleted
        },
        newData: {
            newDescription,
            newCompleted
        },
        whereTo: {
            boardName,
            collectionName
        }
    }

    console.log(body)

    const response = await fetchFunction({
        url: 'http://localhost:3000/edit/tasks/description',
        method: 'post',
        body,
        message: 'Sửa thành công',
        redirectTo: `http://localhost:3000/my-tasks-by/?boardName=${boardName}`
    })
})