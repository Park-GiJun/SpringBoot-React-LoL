import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import axios from "axios";

function RegisterModal({ isOpen, onClose }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [nickName, setNickName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post("http://15.165.163.233:9832/api/auth/register", {
                username,
                password,
                email,
                nickName
            });

            console.log('Registration successful:', response.data);
            onClose();
        } catch (error) {
            console.error('Registration error:', error.response?.data || error.message);
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Register</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full p-2 rounded bg-gray-600 text-white"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full p-2 rounded bg-gray-600 text-white"
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full p-2 rounded bg-gray-600 text-white"
                    required
                />
                <input
                    type="text"
                    value={nickName}
                    onChange={(e) => setNickName(e.target.value)}
                    placeholder="Nickname"
                    className="w-full p-2 rounded bg-gray-600 text-white"
                    required
                />
                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                    Register
                </Button>
            </form>
        </Modal>
    );
}

RegisterModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default RegisterModal;