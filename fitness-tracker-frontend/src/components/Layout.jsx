import React, { useState, useContext } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { AuthContext } from '../contexts/AuthContext';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useContext(AuthContext);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="h-screen overflow-hidden mesh-light flex">
            {user && <Sidebar isOpen={sidebarOpen} user={user} />}
            <div className="flex-1 flex flex-col min-w-0 h-full">
                <Navbar toggleSidebar={toggleSidebar} />
                <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar">
                    {children}
                </main>
            </div>
            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default Layout;
