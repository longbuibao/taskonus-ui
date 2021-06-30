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
    }

})