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

// export const refreshToken = async () => {
//     try {
//         const response = await axios.post(API_URL + 'refresh', {}, {
//             withCredentials: true
//         });
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };

export const logout = () => {
};

export const getCurrentUser = () => {
};

export const isAuthenticated = () => {
    return document.cookie.includes('jwt=');
};
//
// axios.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;
//         if (error.response.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             try {
//                 await refreshToken();
//                 return axios(originalRequest);
//             } catch (refreshError) {
//                 logout();
//                 throw refreshError;
//             }
//         }
//         return Promise.reject(error);
//     }
// );