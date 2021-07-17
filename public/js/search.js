const getAllBoardName = async(url) => {
    const allBoardName = await fetch(
        url
    )
    if (allBoardName.status === 200) {
        return JSON.parse(await allBoardName.text())
    }
    return []
}
const searchByBoardName = async() => {
    const keyword = document.getElementById('searchByBoardName').value
    const url = `http://localhost:3000/search/tasks/?boardName=${keyword}`
    const allBoardName = await getAllBoardName(url)
    if (allBoardName.length !== 0) {
        const linkElement = document.getElementById('link-to-boardname')
        linkElement.innerHTML = ''
        allBoardName.forEach((element) => {
            let a = document.createElement('a')
            a.href = `http://localhost:3000/my-tasks-by/?boardName=${element.item}`
            a.textContent = element.item
            a.style.display = 'block'
            a.setAttribute('target', '_blank')
            linkElement.appendChild(a)
        })
        linkElement.style.display = 'block'
    } else alert('Không tìm thấy bảng này')
}

const redirectTo = (element) => {
    const selected = document.getElementById('filter-tasks').value
    const userId = element.getAttribute('data-user-id')
    const boardName = document.getElementById(`oldBoardName_${userId}`).value
    console.log(selected, boardName)
    switch (selected) {
        case '0':
            window.location.href = `http://localhost:3000/my-tasks-by/?boardName=${boardName}`
            break;
        case '1':
            window.location.href = `http://localhost:3000/my-tasks-by/?boardName=${boardName}&completed=true`
            break;
        case '2':
            window.location.href = `http://localhost:3000/my-tasks-by/?boardName=${boardName}&sortBy=createdAt:asc`
            break;
        case '3':
            window.location.href = `http://localhost:3000/my-tasks-by/?boardName=${boardName}&sortBy=createdAt:desc`
            break;
        default:
            break;
    }
}

const confirmDelete = (input) => {
    confirm(`bạn có thực sự muốn xóa ${input}?`)
}