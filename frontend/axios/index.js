// ✨ implement axiosWithAuth
import axios from 'axios';

export default function axiosWithAuth() {
    const token = localStorage.getItem('token')

    axios.create({
        headers: {
            Authorization: token
        },
        baseURL: 'http://localhost:9000/api/articles'
    })
}