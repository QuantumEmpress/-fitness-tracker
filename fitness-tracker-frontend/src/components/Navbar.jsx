import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { LogOut, User, Menu } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass border-b border-white/20 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="md:hidden p-2 hover:bg-white/50 rounded-xl transition-colors">
                    <Menu size={24} className="text-gray-700" />
                </button>
                {/* Logo only shows on mobile when sidebar is hidden */}
                <div className="md:hidden flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">FP</span>
                    </div>
                    <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600">FitPulse</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <span className="hidden md:block text-gray-700 font-medium">Welcome, <span className="font-bold text-violet-600">{user.username}</span></span>
                        <Link to="/profile" className="p-2 hover:bg-white rounded-xl transition-all text-gray-600 hover:text-violet-600">
                            <User size={22} />
                        </Link>
                        {user.roles && user.roles.includes('ROLE_ADMIN') && (
                            <Link to="/admin" className="hidden md:block px-4 py-2 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 font-semibold transition-colors">
                                Admin
                            </Link>
                        )}
                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 font-semibold transition-colors">
                            <LogOut size={18} />
                            <span className="hidden md:block">Logout</span>
                        </button>
                    </>
                ) : (
                    <div className="flex gap-3">
                        <Link to="/login" className="px-4 py-2 rounded-xl text-violet-600 hover:bg-violet-50 font-semibold transition-colors">Login</Link>
                        <Link to="/signup" className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:shadow-lg transition-all font-semibold">Sign Up</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
