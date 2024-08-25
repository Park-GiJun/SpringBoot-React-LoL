import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import DecoratedNickname from "../components/common/DecorateNickname";

const MyPage = () => {
    const [decorations, setDecorations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nickname, setNickname] = useState('');
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = Cookies.get('token');
            const response = await axios.get('http://15.165.163.233:9832/api/user/decorations', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDecorations(response.data.decorations);
            setNickname(response.data.nickname);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            setMessage({ type: 'error', content: '사용자 데이터를 불러오는데 실패했습니다.' });
            setLoading(false);
        }
    };

    const toggleDecoration = async (id, currentUseFlag) => {
        try {
            const token = Cookies.get('token');
            await axios.put(`http://15.165.163.233:9832/api/user/decorations/${id}`,
                { useFlag: !currentUseFlag },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setDecorations(prevDecorations =>
                prevDecorations.map(decoration =>
                    decoration.id === id
                        ? {...decoration, useFlag: !currentUseFlag}
                        : decoration
                )
            );

            setMessage({ type: 'success', content: '장식 설정이 변경되었습니다.' });
        } catch (error) {
            console.error('Failed to toggle decoration:', error);
            setMessage({ type: 'error', content: '장식 설정 변경에 실패했습니다.' });
        }
    };

    if (loading) {
        return <div className="text-center">로딩 중...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">마이페이지</h1>

            {message && (
                <div className={`p-4 mb-4 rounded ${message.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
                    {message.content}
                </div>
            )}

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">현재 닉네임 미리보기</h2>
                <DecoratedNickname nickname={nickname} />
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">보유 중인 장식</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {decorations.map(decoration => (
                        <div key={decoration.id} className="bg-gray-800 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">{decoration.name}</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={decoration.useFlag}
                                        onChange={() => toggleDecoration(decoration.id, decoration.useFlag)}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <p className="text-sm text-gray-400">{decoration.description}</p>
                            <p className="text-sm text-gray-400 mt-1">타입: {decoration.type}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyPage;