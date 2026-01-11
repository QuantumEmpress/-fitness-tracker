import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import { Users, Activity, Dumbbell, Trash2, ShieldCheck } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalWorkouts: 0,
        totalExercises: 0
    });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Fetch stats and users in parallel
            const [statsRes, usersRes] = await Promise.all([
                adminService.getStats(),
                adminService.getAllUsers()
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching admin data:", err);
            setError("Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await adminService.deleteUser(id);
                setUsers(users.filter(user => user.id !== id));
            } catch (err) {
                console.error("Error deleting user:", err);
                alert("Failed to delete user.");
            }
        }
    };

    const handlePromoteUser = async (id) => {
        if (window.confirm("Are you sure you want to promote this user to Admin?")) {
            try {
                await adminService.promoteUser(id);
                // Refresh users list to reflect role change
                const usersRes = await adminService.getAllUsers();
                setUsers(usersRes.data);
                alert("User promoted successfully!");
            } catch (err) {
                console.error("Error promoting user:", err);
                alert("Failed to promote user.");
            }
        }
    };

    const handleBanUser = async (id) => {
        if (window.confirm("Are you sure you want to ban this user?")) {
            try {
                await adminService.banUser(id);
                const usersRes = await adminService.getAllUsers();
                setUsers(usersRes.data);
                alert("User banned successfully!");
            } catch (err) {
                console.error("Error banning user:", err);
                alert("Failed to ban user.");
            }
        }
    };

    const handleUnbanUser = async (id) => {
        if (window.confirm("Are you sure you want to unban this user?")) {
            try {
                await adminService.unbanUser(id);
                const usersRes = await adminService.getAllUsers();
                setUsers(usersRes.data);
                alert("User unbanned successfully!");
            } catch (err) {
                console.error("Error unbanning user:", err);
                alert("Failed to unban user.");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Users</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                        <Activity size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Workouts</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.totalWorkouts}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                        <Dumbbell size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Exercises</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.totalExercises}</p>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-1">
                                            {user.roles && user.roles.map((role, index) => (
                                                <span key={index} className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${role === 'ROLE_ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                                    {role.replace('ROLE_', '')}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.enabled ? 'Active' : 'Banned'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            {!user.roles.includes('ROLE_ADMIN') && (
                                                <button
                                                    onClick={() => handlePromoteUser(user.id)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                    title="Promote to Admin"
                                                >
                                                    <ShieldCheck size={18} />
                                                </button>
                                            )}
                                            {user.enabled ? (
                                                <button
                                                    onClick={() => handleBanUser(user.id)}
                                                    className="text-orange-600 hover:text-orange-900"
                                                    title="Ban User"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleUnbanUser(user.id)}
                                                    className="text-green-600 hover:text-green-900"
                                                    title="Unban User"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Delete User"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
