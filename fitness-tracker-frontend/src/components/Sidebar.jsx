import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, Activity, Target, Settings, Users, Trophy, Camera, Calculator, FileText } from 'lucide-react';

const Sidebar = ({ isOpen, user }) => {
    const location = useLocation();

    const links = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Exercises', path: '/exercises', icon: <Dumbbell size={20} /> },
        { name: 'Workouts', path: '/workouts', icon: <Activity size={20} /> },
        { name: 'Goals', path: '/goals', icon: <Target size={20} /> },
        { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={20} /> },
        { name: 'Gallery', path: '/progress-photos', icon: <Camera size={20} /> },
        { name: 'Calculators', path: '/calculators', icon: <Calculator size={20} /> },
        { name: 'Profile', path: '/profile', icon: <Settings size={20} /> },
    ];

    if (user && user.roles && user.roles.includes('ROLE_ADMIN')) {
        links.push({ name: 'Admin', path: '/admin', icon: <Users size={20} /> });
        links.push({ name: 'Audit Logs', path: '/audit-logs', icon: <FileText size={20} /> });
    }

    return (
        <aside className={`fixed md:sticky top-0 inset-y-0 left-0 z-40 w-72 h-screen transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 border-r border-white/40 bg-white/70 backdrop-blur-xl shadow-2xl`}>
            <div className="p-8 h-full flex flex-col">
                <div className="mb-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-violet-200">
                        <Activity size={22} className="animate-pulse" />
                    </div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600 font-sans tracking-tight">FitPulse</h1>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4 font-sans">Menu</p>
                    {links.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                                    ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-200 scale-100'
                                    : 'text-gray-500 hover:bg-white hover:shadow-md hover:text-violet-600 hover:scale-[1.02]'
                                    }`}
                            >
                                <span className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-violet-500'} transition-colors`}>
                                    {link.icon}
                                </span>
                                <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>{link.name}</span>
                                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100/50">
                    <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 p-4 rounded-2xl border border-white/60 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-violet-500 font-bold shadow-sm">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-800 truncate">{user?.username || 'Guest'}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email || 'View Profile'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
