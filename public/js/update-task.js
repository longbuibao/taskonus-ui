const oldBoardName = document.getElementById('oldBoardName').value

const boardNameEdit = document.getElementById('boardNameEdit')
const boardNameDelete = document.getElementById('boardNameDelete')

boardNameEdit.addEventListener('click', async() => {
    const newBoardName = document.getElementById('oldBoardName').value
    const body = {
        oldBoardName,
        newBoardName
    }
    const response = await fetch(
        `http://localhost:3000/edit/tasks/boardName`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }
    )
    if (response.status === 200) {
        window.location.href = `http://localhost:3000/my-tasks-by/?boardName=${newBoardName}`
    } else {
        alert('Không thể xóa bảng, vui lòng thử lại')
    }
})

boardNameDelete.addEventListener('click', async() => {
    const boardName = document.getElementById('oldBoardName').value
    const body = {
        boardName
    }
    const response = await fetch(
        `http://localhost:3000/edit/tasks/boardName`, {
            method: 'DELETE',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }
    )
    if (response.status === 200) {
        window.location.href = "http://localhost:3000/my-tasks"
    } else {
        alert('Không thể xóa bảng, vui lòng thử lại')
    }
})