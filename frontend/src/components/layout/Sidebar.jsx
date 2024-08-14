import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../common/Button';
import LoginModal from '../../features/auth/LoginModal';
import RegisterModal from '../../features/auth/RegisterModal';
import api from '../../utils/api';  // api 인스턴스 import

// TODO : 로그인시 로그인버튼, 회원가입 버튼 안보이고 로그 아웃 버튼으로 대체, 사이드바에서 현재 로그인한 닉네임, 포인트 출력


function Sidebar({ isOpen, setIsOpen, toggleChat }) {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [testResponse, setTestResponse] = useState('');
    const [nickname, setNickname] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userPoints, setUserPoints] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        checkLoginStatus();
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            fetchUserPoints();
        }
    }, [isLoggedIn]);

    const checkLoginStatus = () => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    };

    const fetchUserPoints = async () => {
        try {
            const response = await api.get('/api/user/points');
            console.error(response.data);
            if (response.data !== undefined && typeof response.data === 'number') {
                setUserPoints(response.data);
            } else {
                console.error('Unexpected response format:', response);
                setUserPoints(0);
            }
        } catch (error) {
            console.error('Error fetching user points:', error);
            if (error.response) {
                console.error('Server responded with error:', error.response.status, error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up request:', error.message);
            }
            setUserPoints(0);
        }
    };

    const toggleNavigation = () => setIsOpen(!isOpen);

    const navItems = [
        {path: '/', label: '홈'},
        {path: '/stats', label: '전적 검색'},
        {path: 'multiSearch', label: '멀티 서치'},
        {path: '/ranking', label: '기록실'},
        {path: '/matches', label: '경기'},
        {path: '/schedule', label: '게임 일정'},
        {path: '/league', label: '리그'},
        {path: '/chatRoom', label: '채팅방'},
        {path: '/saveGame', label: '게임저장'}
    ];

    const handleTestButtonClick = () => {
        navigate('/test');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (nickname.trim()) {
            navigate(`/stats/${nickname}`);
        }
    };

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        setIsLoginModalOpen(false);
        fetchUserPoints();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserPoints(0);
    };

    const renderAuthButton = () => {
        if (isLoggedIn) {
            return (
                <>
                    <div className="text-center mb-2">
                        <p>포인트: {userPoints}</p>
                    </div>
                    <Button
                        onClick={handleLogout}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Logout
                    </Button>
                </>
            );
        } else {
            return (
                <>
                    <Button
                        onClick={() => setIsLoginModalOpen(true)}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Login
                    </Button>
                    <Button
                        onClick={() => setIsRegisterModalOpen(true)}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Register
                    </Button>
                </>
            );
        }
    };

    const renderContent = () => (
        <>
            <form onSubmit={handleSearch} className="px-4 mb-1 relative">
                <input
                    type="text"
                    placeholder="닉네임 검색"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full p-2 pr-10 rounded bg-gray-900 text-white"
                />
                <button
                    type="submit"
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 focus:outline-none"
                >
                    <svg fill="#ffffff" width="20px" height="20px" viewBox="0 0 490.4 490.4" xmlns="http://www.w3.org/2000/svg">
                        <path d="M484.1,454.796l-110.5-110.6c29.8-36.3,47.6-82.8,47.6-133.4c0-116.3-94.3-210.6-210.6-210.6S0,94.496,0,210.796 s94.3,210.6,210.6,210.6c50.8,0,97.4-18,133.8-48l110.5,110.5c12.9,11.8,25,4.2,29.2,0C492.5,475.596,492.5,463.096,484.1,454.796z M41.1,210.796c0-93.6,75.9-169.5,169.5-169.5s169.6,75.9,169.6,169.5s-75.9,169.5-169.5,169.5S41.1,304.396,41.1,210.796z"/>
                    </svg>
                </button>
            </form>
            <nav className="flex-1 overflow-auto">
                <ul className="space-y-2 py-4">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`block px-4 py-2 hover:bg-gray-800 ${
                                    location.pathname === item.path
                                        ? 'bg-blue-600 text-white'
                                        : ''
                                }`}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 space-y-2">
                {renderAuthButton()}
                <Button
                    onClick={toggleChat}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                    채팅
                </Button>
                <Button
                    onClick={handleTestButtonClick}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                >
                    Test API
                </Button>
                {testResponse && (
                    <div className="mt-4 p-2 bg-gray-800 text-white rounded text-xs">
                        {testResponse}
                    </div>
                )}
            </div>
        </>
    );

    return (
        <>
            {isMobile ? (
                <div className="bg-gray-800 text-gray-100">
                    <div className="flex justify-between items-center p-4">
                        <div className="text-3xl font-bold flex items-center">
                            OLM
                            <p className="text-[0.6rem] ml-1">오롤몇</p>
                        </div>
                        <button
                            className="p-1 bg-gray-800 text-white rounded-md focus:outline-none"
                            onClick={toggleNavigation}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                            </svg>
                        </button>
                    </div>
                    {isOpen && (
                        <div className="p-4">
                            {renderContent()}
                        </div>
                    )}
                </div>
            ) : (
                <div
                    className={`fixed top-0 left-0 h-screen bg-gray-800 text-gray-100 transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} overflow-hidden flex flex-col`}
                >
                    <div className="flex justify-between items-center p-4">
                        <div className="text-3xl font-bold flex items-center">
                            {isOpen ? (
                                <>
                                    OLM
                                    <p className="text-[0.6rem] ml-1">오롤몇</p>
                                </>
                            ) : null}
                        </div>

                        <button
                            className="p-1 bg-gray-800 text-white rounded-md focus:outline-none"
                            onClick={toggleNavigation}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                            </svg>
                        </button>
                    </div>
                    {isOpen && renderContent()}
                </div>
            )}
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onLoginSuccess={handleLoginSuccess}
            />
            <RegisterModal
                isOpen={isRegisterModalOpen}
                onClose={() => setIsRegisterModalOpen(false)}
            />
        </>
    );
}

export default Sidebar;