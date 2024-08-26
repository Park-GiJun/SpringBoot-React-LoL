import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import LoadingSpinner from "../components/common/Loading";
import Cookies from "js-cookie";
import NicknameDecorationPreview from "../components/common/NicknameDecorationPreview";

const MyPage = () => {
    const [decorations, setDecorations] = useState([]);
    const [nickname, setNickname] = useState('');
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [selectedEffects, setSelectedEffects] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = Cookies.get('token');
            const response = await axios.post('http://15.165.163.233:9832/api/user/decorations', {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data && Array.isArray(response.data)) {
                const processedDecorations = response.data.map(item => ({
                    id: item.id,
                    name: item.style.name,
                    type: item.type.toLowerCase(),
                    description: item.style.description,
                    useFlag: item.useFlag,
                    style: JSON.parse(item.style.style)
                }));
                setDecorations(processedDecorations);
                setSelectedEffects(processedDecorations.reduce((acc, item) => {
                    if (item.useFlag) {
                        acc[item.type] = item.id;
                    }
                    return acc;
                }, {}));
                if (response.data.length > 0) {
                    setNickname(response.data[0].nickname);
                }
            } else {
                throw new Error('Invalid data structure received from server');
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError("Failed to load user data. Please try again later.");
            setLoading(false);
        }
    };

    const categorizedItems = useMemo(() => {
        return decorations.reduce((acc, item) => {
            if (!acc[item.type]) {
                acc[item.type] = [];
            }
            acc[item.type].push(item);
            return acc;
        }, { ALL: decorations });
    }, [decorations]);

    const categories = useMemo(() => ['ALL', ...Object.keys(categorizedItems).filter(cat => cat !== 'ALL')], [categorizedItems]);

    const toggleEffect = async (item) => {
        const newSelectedEffects = { ...selectedEffects };
        if (newSelectedEffects[item.type] === item.id) {
            delete newSelectedEffects[item.type];
        } else {
            newSelectedEffects[item.type] = item.id;
        }

        setSelectedEffects(newSelectedEffects);

        const updatedDecorations = decorations.map(decoration => ({
            ...decoration,
            useFlag: newSelectedEffects[decoration.type] === decoration.id
        }));

        setDecorations(updatedDecorations);

        try {
            await sendUpdatedEffectsToServer(updatedDecorations);
        } catch (error) {
            console.error('Failed to update decorations on server:', error);
        }
    };

    const sendUpdatedEffectsToServer = async (updatedDecorations) => {
        const token = Cookies.get('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const updatedEffects = updatedDecorations.map(decoration => ({
            id: decoration.id,
            useFlag: decoration.useFlag
        }));

        await axios.put('http://15.165.163.233:9832/api/user/update-decoration',
            { decorations: updatedEffects },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
    };

    const getSelectedItems = () => {
        return decorations.filter(item => selectedEffects[item.type] === item.id);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="text-center p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">마이페이지</h1>

            <NicknameDecorationPreview
                selectedItems={getSelectedItems()}
                initialNickname={nickname}
            />

            <div className="mb-4">
                <div className="flex border-b border-gray-700">
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`py-2 px-4 font-semibold ${activeCategory === category ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
                            onClick={() => setActiveCategory(category)}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categorizedItems[activeCategory]?.map(item => (
                    <div key={item.id} className="border rounded-lg p-4 flex flex-col justify-between bg-gray-800">
                        <div>
                            <h2 className="text-lg font-semibold">{item.name}</h2>
                            <p className="text-gray-400">{item.description}</p>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                            <button
                                onClick={() => toggleEffect(item)}
                                className={`px-4 py-2 rounded ${selectedEffects[item.type] === item.id ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-200'}`}
                            >
                                {selectedEffects[item.type] === item.id ? '사용 중' : '사용하기'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyPage;