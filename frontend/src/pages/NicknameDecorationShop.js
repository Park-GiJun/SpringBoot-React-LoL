import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from "../components/common/Loading";
import { ShoppingCart, Sparkles } from 'lucide-react';
import Cookies from "js-cookie";
import api from "../utils/api";

const NicknameDecorationShop = () => {
    const [cart, setCart] = useState([]);
    const [nickname, setNickname] = useState("OLM");
    const [activeCategory, setActiveCategory] = useState("color");
    const [selectedEffects, setSelectedEffects] = useState({});
    const [shopItems, setShopItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userPoints, setUserPoints] = useState(0);

    useEffect(() => {
        const fetchStyles = async () => {
            try {
                const response = await axios.get('http://15.165.163.233:9832/public/getAllStyles');
                setShopItems(response.data.map(item => ({
                    id: item.styleId,
                    name: item.name,
                    type: item.type.toLowerCase(),
                    description: item.description,
                    price: item.price,
                    style: JSON.parse(item.style)
                })));
                setLoading(false);
            } catch (err) {
                console.error("Error fetching styles:", err);
                setError("Failed to load shop items. Please try again later.");
                setLoading(false);
            }
        };
        fetchUserPoints();
        fetchStyles();
    }, []);

    const fetchUserPoints = async () => {
        const token = Cookies.get('token');
        if (!token) return;

        try {
            const response = await api.get('http://15.165.163.233:9832/api/user/points', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUserPoints(response.data);
        } catch (error) {
            console.error('Error fetching user points:', error);
        }
    };

    const categorizedItems = useMemo(() => {
        return shopItems.reduce((acc, item) => {
            if (!acc[item.type]) {
                acc[item.type] = [];
            }
            acc[item.type].push(item);
            return acc;
        }, {});
    }, [shopItems]);

    const categories = useMemo(() => Object.keys(categorizedItems), [categorizedItems]);
    const toggleEffect = (item) => {
        setSelectedEffects(prev => {
            const newEffects = { ...prev };
            if (newEffects[item.type] === item.id) {
                delete newEffects[item.type];
            } else {
                newEffects[item.type] = item.id;
            }
            return newEffects;
        });
    };

    const addToCart = (item) => {
        setCart(prev => [...prev, item]);
    };

    const removeFromCart = (itemId) => {
        setCart(prev => prev.filter(item => item.id !== itemId));
    };

    const checkout = async () => {
        const token = Cookies.get('token');
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }

        const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
        console.log("User Points:", userPoints, "Total Price:", totalPrice);
        if (totalPrice > userPoints) {
            alert('포인트가 부족합니다.');
            return;
        }

        try {
            const response = await axios.post('http://15.165.163.233:9832/user/purchaseStyles',
                { styleIds: cart.map(item => item.id) },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                alert('구매가 완료되었습니다!');
                setCart([]);
                setUserPoints(prevPoints => prevPoints - totalPrice);
                fetchUserPoints();
            } else {
                alert(response.data.message || '구매 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('Purchase error:', error);
            if (error.response) {
                if (error.response.status === 401) {
                    Cookies.remove('token');
                    alert('세션이 만료되었습니다. 다시 로그인해 주세요.');
                } else {
                    alert(error.response.data.message || '구매 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
                }
            } else if (error.request) {
                alert('서버에 연결할 수 없습니다. 네트워크 연결을 확인해 주세요.');
            } else {
                alert('구매 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
            }
        }
    };


    const getPreviewStyle = () => {
        return shopItems
            .filter(item => selectedEffects[item.type] === item.id)
            .reduce((style, item) => {
                if (item.style && typeof item.style === 'object') {
                    const itemStyle = item.style.previewStyle || item.style;
                    return { ...style, ...itemStyle };
                }
                return style;
            }, {});
    };


    const getPreviewClass = () => {
        return shopItems
            .filter(item => selectedEffects[item.type] === item.id)
            .map(item => item.style && item.style.previewClass)
            .filter(Boolean)
            .join(' ');
    };

    const getPreviewContent = () => {
        const contents = shopItems
            .filter(item => selectedEffects[item.type] === item.id)
            .map(item => item.style && item.style.previewContent)
            .filter(Boolean);

        return contents.map((content, index) => {
            if (typeof content === 'string' && content.startsWith('<svg')) {
                return (
                    <span key={index} className="nickname-container">
                    <span>{nickname}</span>
                    <span dangerouslySetInnerHTML={{ __html: content }} />
                </span>
                );
            }
            return <span key={index}>{content}</span>;
        });
    };



    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="text-center p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">포인트 상점</h1>

            <div className="mb-4">
                <label htmlFor="nickname" className="block text-sm font-medium text-gray-300 mb-2">예제</label>
                <input
                    type="text"
                    id="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="bg-gray-700 text-white px-3 py-2 rounded-md w-full"
                />
            </div>

            <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">미리보기</h2>
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                    <span
                        className={`text-2xl font-bold ${getPreviewClass()}`}
                        style={getPreviewStyle()}
                        data-text={nickname}
                    >
                        {getPreviewContent()}{nickname}
                    </span>
                </div>
            </div>

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
                            <p className="text-blue-400 font-bold mt-2">{item.price} points</p>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                            <button
                                onClick={() => toggleEffect(item)}
                                className={`px-4 py-2 rounded ${selectedEffects[item.type] === item.id ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-200'}`}
                            >
                                {selectedEffects[item.type] === item.id ? 'Selected' : 'Select'}
                            </button>
                            <button
                                onClick={() => addToCart(item)}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300 flex items-center"
                            >
                                <ShoppingCart className="mr-2" size={18}/>
                                추가
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 border-t border-gray-700 pt-4">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                    <ShoppingCart className="mr-2" size={24}/>
                    장바구니
                </h2>
                {cart.length === 0 ? (
                    <p className="text-gray-400">장바구니가 비었습니다.</p>
                ) : (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {cart.map(item => (
                                <div key={item.id} className="bg-gray-700 p-4 rounded-lg flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                                        <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                                        <p className="text-blue-400 font-bold">{item.price} 포인트</p>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-300"
                                        >
                                            제거
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 bg-gray-800 p-4 rounded-lg">
                            <p className="text-xl font-bold mb-4">
                                총 금액: {cart.reduce((sum, item) => sum + item.price, 0)} 포인트
                            </p>
                            <button
                                onClick={checkout}
                                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300 flex items-center justify-center"
                            >
                                <Sparkles className="mr-2" size={18}/>
                                구매하기
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NicknameDecorationShop;