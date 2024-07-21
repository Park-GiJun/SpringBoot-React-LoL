import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/layout/Sidebar';
import MainPage from './pages/MainPage';
import Schedule from "./pages/Schedule";
import SaveGame from "./pages/SaveGame";

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <AuthProvider>
            <Router>
                <div className="flex h-screen max-h-screen overflow-hidden bg-gray-900 text-gray-100">
                    <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                    <main className={`flex-1 p-4 lg:p-6 overflow-auto transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
                        <Routes>
                            <Route path="/" element={<MainPage />} />
                            <Route path="/schedule" element={<Schedule />}/>
                            <Route path="/saveGame" element={<SaveGame />}/>
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;