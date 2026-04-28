import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const predict = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/predict`, data);
        return response.data;
    } catch (error) {
        console.error("Error during prediction:", error);
        throw error;
    }
};

export const getStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/stats`);
        return response.data;
    } catch (error) {
        console.error("Error fetching stats:", error);
        throw error;
    }
};

export const uploadDataset = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${API_URL}/upload-dataset`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading dataset:', error);
        throw error;
    }
};

export const getPredictions = async () => {
    try {
        const response = await axios.get(`${API_URL}/predictions`);
        return response.data;
    } catch (error) {
        console.error('Error fetching predictions:', error);
        throw error;
    }
};
