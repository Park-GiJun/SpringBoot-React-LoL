import React from 'react';
import Sidebar from './Sidebar';

function MainLayout({ children }) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-grow p-6 bg-gray-100 dark:bg-gray-800 transition-colors duration-300">
                {children}
            </main>
        </div>
    );
}

export default MainLayout;