import { api } from '../client'

export const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    return api.post('/files/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}