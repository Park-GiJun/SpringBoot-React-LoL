import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Cookies from 'js-cookie';
import api from '../../utils/api';  // api 인스턴스 import

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/api/auth/login', {
                username,
                password
            });
            console.log('Login successful', response.data);

            Cookies.set('token', response.data.token, {
                expires: 7,
                sameSite: 'lax'
            });

            onLoginSuccess();
            onClose();
        } catch (error) {
            setError('Login failed. Please check your credentials.');
            console.error('Login error', error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleLogin} className="space-y-4">
                {error && <p className="text-red-500">{error}</p>}
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full p-2 rounded bg-gray-600 text-white"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full p-2 rounded bg-gray-600 text-white"
                />
                <Button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                    Login
                </Button>
            </form>
        </Modal>
    );
}

LoginModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onLoginSuccess: PropTypes.func.isRequired,
};

export default LoginModal;