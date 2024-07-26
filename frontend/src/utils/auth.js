import axios from 'axios';

const API_URL = 'http://15.165.163.233:9832/api/auth/';

export const login = async (username, password) => {
    try {
        const response = await axios.post(API_URL + 'login', { username, password });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

export const authHeader = () => {
    const user = getCurrentUser();
    if (user.token && user) {
        return { Authorization: 'Bearer ' + user.token };
    } else {
        return {};
    }
};