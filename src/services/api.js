

import axios from "axios";

const api = axios.create({
    baseURL: 'https://mailbite.io/api/check?'
})

export default api;