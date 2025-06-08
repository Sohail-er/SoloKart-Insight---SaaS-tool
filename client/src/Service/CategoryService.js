import axios from "axios";

const API_URL = 'http://localhost:8080/api/v1.0';

export const addCategory = async (category) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }
    
    return await axios.post(`${API_URL}/admin/categories`, category, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const deleteCategory = async (categoryId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }
    
    return await axios.delete(`${API_URL}/admin/categories/${categoryId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

export const fetchCategories = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }
    
    return await axios.get(`${API_URL}/categories`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}