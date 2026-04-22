import { api } from './client.ts'

export const checkHealth = async () => {
    return api.get('/health-check/')
}

export const checkNeonHealth = async () => {
    return api.get('/health-check/neon/')
}