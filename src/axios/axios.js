import axios from 'axios'

const fun = (url, params = {}, method = 'GET') => {
    return axios({
        url: 'http://localhost:8080/OnlineEducation' + url,
        params,
        method
    })
}

export default fun;