import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/layout/Sidebar';
import MainPage from './pages/MainPage';
import Schedule from "./pages/Schedule";
import SaveGame from "./pages/SaveGame";
import Stats from "./pages/Stats";

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <AuthProvider>
            <Router>
                <div className="flex h-screen max-h-screen overflow-hidden bg-gray-900 text-gray-100">
                    <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                    <main className={`flex-1 p-4 lg:p-6 overflow-auto transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
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
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;