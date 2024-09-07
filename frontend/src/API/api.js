


import axios from 'axios';
const BASE_URL = import.meta.env.VITE_APP_URI_API;
const userData = localStorage.getItem('user');
const parsedData = JSON.parse(userData);
const userId = parsedData._id;

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_URI_API, // Base URL from environment variable
    headers: {
        'Content-Type': 'application/json',
    },
});


export const addFile = async (formData) => {
    await api.post(`/api/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
};

export const getFiles = async () => {
    const response = await api.get(`/api/files`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data.files;
};

export const deleteFile = async (fileId) => {
    await api.delete(`/api/files/${fileId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
};
