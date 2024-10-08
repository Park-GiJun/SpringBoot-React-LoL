import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/layout/Sidebar';
import MainPage from './pages/MainPage';
import Schedule from "./pages/Schedule";
import SaveGame from "./pages/SaveGame";
import Stats from "./pages/Stats";
import Ranking from "./pages/Ranking";
import League from "./pages/League";
import MultiSearch from "./pages/MultiSearch";
import TestPage from "./pages/Test";
import ChatRoom from "./pages/ChatRoom";
import Bet from "./pages/Bet";
import NicknameDecorationShop from "./pages/NicknameDecorationShop";
import MyPage from "./pages/MyPage";


function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    return (
        <AuthProvider>
            <Router>
                <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-gray-900 text-gray-100">
                    <Sidebar
                        isOpen={isSidebarOpen}
                        setIsOpen={setIsSidebarOpen}
                        toggleChat={toggleChat}
                    />
                    <main className={`flex-1 p-4 lg:p-6 overflow-auto transition-all duration-300 ${
                        isMobile
                            ? isSidebarOpen ? 'mt-[100px]' : 'mt-16'
                            : isSidebarOpen ? 'ml-64' : 'ml-16'
                    }`}>
                        <Routes>
                            <Route path="/" element={
                                <>
                                    <Helmet>
                                        <title>메인 페이지 | OLM</title>
                                    </Helmet>
                                    <MainPage />
                                </>
                            } />
                            <Route path="/schedule" element={
                                <>
                                    <Helmet>
                                        <title>달력 | OLM</title>
                                    </Helmet>
                                    <Schedule />
                                </>
                            } />
                            <Route path="/ranking" element={
                                <>
                                <Helmet>
                                    <title>기록실 | OLM</title>
                                </Helmet>
                                    <Ranking />
                                </>
                            } />
                            <Route path="/saveGame" element={
                                <>
                                    <Helmet>
                                        <title>게임 저장 | OLM</title>
                                    </Helmet>
                                    <SaveGame />
                                </>
                            } />
                            <Route path="/stats" element={
                                <>
                                    <Helmet>
                                        <title>전적 검색 | OLM</title>
                                    </Helmet>
                                    <Stats />
                                </>
                            } />
                            <Route path="/multiSearch" element={
                                <>
                                    <Helmet>
                                        <title>멀티 서치 | OLM</title>
                                    </Helmet>
                                    <MultiSearch />
                                </>
                            } />
                            <Route path="/league" element={
                                <>
                                    <Helmet>
                                        <title>리그 | OLM</title>
                                    </Helmet>
                                    <League />
                                </>
                            } />
                            <Route path="/test" element={
                                <>
                                    <Helmet>
                                        <title>박기준 전용 테스트 페이지</title>
                                    </Helmet>
                                    <TestPage />
                                </>
                            } />
                            <Route path="/bet" element={
                                <>
                                    <Helmet>
                                        <title>베팅 | OLM</title>
                                    </Helmet>
                                    <Bet />
                                </>
                            } />
                            <Route path="/shop" element={
                                <>
                                    <Helmet>
                                        <title>포인트샵 | OLM</title>
                                    </Helmet>
                                    <NicknameDecorationShop />
                                </>
                            } />
                            <Route path="/myPage" element={
                                <>
                                    <Helmet>
                                        <title>마이 페이지 | OLM</title>
                                    </Helmet>
                                    <MyPage />
                                </>
                            } />
                        </Routes>
                    </main>
                    <ChatRoom
                        isOpen={isChatOpen}
                        onClose={() => setIsChatOpen(false)}
                        initialUsername={username}
                    />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;