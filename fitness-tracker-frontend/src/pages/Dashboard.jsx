import React, { useEffect, useState } from 'react';
import dashboardService from '../services/dashboardService';
import { Activity, TrendingUp, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardSkeleton from '../components/DashboardSkeleton';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await dashboardService.getDashboardStats();
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="p-6"><DashboardSkeleton /></div>;

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Welcome Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back! 👋</h1>
                    <p className="text-gray-500 text-lg">Here's your fitness journey overview</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Workouts Card */}
                <div className="glass-card p-6 hover:scale-105 transition-transform duration-300 group">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white rounded-2xl shadow-lg shadow-violet-200 group-hover:shadow-xl transition-shadow">
                            <Activity size={28} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Total Workouts</p>
                            <p className="text-3xl font-black text-gray-800">{stats?.totalWorkouts || 0}</p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                            <TrendingUp size={14} className="text-green-500" />
                            <span className="text-green-500 font-semibold">Keep it up!</span>
                        </p>
                    </div>
                </div>

                {/* Calories Burned Card */}
                <div className="glass-card p-6 hover:scale-105 transition-transform duration-300 group">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-2xl shadow-lg shadow-pink-200 group-hover:shadow-xl transition-shadow">
                            <TrendingUp size={28} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Calories Burned</p>
                            <p className="text-3xl font-black text-gray-800">{stats?.totalCaloriesBurned || 0}</p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-400">
                            <span className="text-pink-500 font-semibold">🔥 On fire!</span>
                        </p>
                    </div>
                </div>

                {/* Active Days Card */}
                <div className="glass-card p-6 hover:scale-105 transition-transform duration-300 group">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-2xl shadow-lg shadow-cyan-200 group-hover:shadow-xl transition-shadow">
                            <Calendar size={28} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Active Days</p>
                            <p className="text-3xl font-black text-gray-800">
                                {stats?.weeklyTrends?.filter(d => d.count > 0).length || 0}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-400">
                            <span className="text-cyan-500 font-semibold">This week</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Weekly Progress Chart */}
            <div className="glass-card p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Weekly Progress</h2>
                        <p className="text-sm text-gray-500 mt-1">Track your workout consistency</p>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-50 to-fuchsia-50 border border-violet-100">
                        <span className="text-sm font-semibold text-violet-600">Last 7 Days</span>
                    </div>
                </div>
                <div className="w-full" style={{ height: '350px' }}>
                    {stats?.weeklyTrends && stats.weeklyTrends.length > 0 ? (
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={stats.weeklyTrends}>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#ec4899" stopOpacity={0.8} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="week"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 13, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 13, fontWeight: 600 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
                                        padding: '12px 16px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                    labelStyle={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}
                                    itemStyle={{ color: '#8b5cf6', fontWeight: 600 }}
                                />
                                <Bar
                                    dataKey="count"
                                    fill="url(#barGradient)"
                                    radius={[12, 12, 0, 0]}
                                    barSize={50}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 py-8">
                            <img
                                src="/src/assets/images/1.png"
                                alt="Start your journey"
                                className="w-64 mb-6 drop-shadow-xl animate-float"
                            />
                            <p className="text-xl font-semibold text-gray-600 mb-2">No workout data available</p>
                            <p className="text-sm">Start logging workouts to see your progress!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
