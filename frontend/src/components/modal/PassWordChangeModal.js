import React, { useState } from 'react';
import Modal from '../../components/common/Modal';
import axios from 'axios';

function PasswordChangeModal({ isOpen, onClose }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (newPassword !== confirmPassword) {
            setError('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await axios.post('http://15.165.163.233:9832/change-password', {
                currentPassword,
                newPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                setSuccess(true);
                setTimeout(() => {
                    onClose();
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                }, 2000);
            }
        } catch (error) {
            setError(error.response?.data?.message || '비밀번호 변경에 실패했습니다.');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-bold mb-4">비밀번호 변경</h2>
            {success ? (
                <p className="text-green-500">비밀번호가 성공적으로 변경되었습니다.</p>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="currentPassword" className="block mb-1">현재 비밀번호</label>
                        <input
                            type="password"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block mb-1">새 비밀번호</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block mb-1">새 비밀번호 확인</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 rounded"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        비밀번호 변경
                    </button>
                </form>
            )}
        </Modal>
    );
}

export default PasswordChangeModal;