import { api } from '../client.ts'
import type { Product } from './types.ts'

// 🔹 Get all products
export const getProducts = async () => {
    return api.get('/products/')
}

// 🔹 Get paginated products
export const getProductsPaginated = async (pageSize: number, page: number) => {
    return api.get(`/products?page-size=${pageSize}&page=${page}`)
}

// 🔹 Get product by ID
export const getProductById = async (id: number) => {
    return api.get(`/products/${id}`)
}

// 🔹 Create product
export const createProduct = async (product: Product) => {
    return api.post('/products/', product)
}

// 🔹 Update product
export const updateProduct = async (id: number, product: Product) => {
    return api.put(`/products/${id}`, product)
}

// 🔹 Delete product
export const deleteProduct = async (id: number) => {
    return api.delete(`/products/${id}`)
}