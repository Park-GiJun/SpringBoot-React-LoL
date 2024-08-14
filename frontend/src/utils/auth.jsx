import axios from 'axios';

const API_URL = 'http://15.165.163.233:9832/api/auth/';

export const login = async (username, password) => {
    try {
        const response = await axios.post(API_URL + 'login', { username, password }, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logout = () => {
};

export const getCurrentUser = () => {
};

export const isAuthenticated = () => {
    return document.cookie.includes('jwt=');
};