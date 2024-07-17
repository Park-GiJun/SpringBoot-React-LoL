import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/layout/Sidebar';
import MainPage from './pages/MainPage';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr] h-screen max-h-screen overflow-hidden bg-gray-900 text-gray-100">
                    <Sidebar />
                    <main className="p-4 lg:p-6 overflow-auto">
                        <Routes>
                            <Route path="/" element={<MainPage />} />
                            {/* 다른 라우트들... */}
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;