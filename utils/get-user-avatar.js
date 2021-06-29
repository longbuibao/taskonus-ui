const axios = require('axios')
const getUserAvatar = async(_id) => {
    const data = await axios.get(
        `http://localhost:8000/users/${_id}/avatar`
    )
    return data
}

module.exports = getUserAvatar