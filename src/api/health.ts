import axios from 'axios'

export const checkHealth = async () => {
    return axios.get('/health-check', {
        timeout: 1 // forces timeout immediately
    })
}