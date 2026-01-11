import React, { useState, useEffect } from 'react';
import leaderboardService from '../services/leaderboardService';
import { Trophy, Medal, User } from 'lucide-react';
import TableSkeleton from '../components/TableSkeleton';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const response = await leaderboardService.getLeaderboard();
            setLeaders(response.data);
        } catch (error) {
            console.error("Failed to fetch leaderboard", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-6"><TableSkeleton rows={10} columns={3} /></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Trophy className="text-yellow-500" size={32} />
                Community Leaderboard
            </h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-700">Top Performers (All Time)</h2>
                </div>

                <div className="divide-y divide-gray-100">
                    {leaders.map((leader, index) => (
                        <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                    index === 1 ? 'bg-gray-100 text-gray-600' :
                                        index === 2 ? 'bg-orange-100 text-orange-600' :
                                            'text-gray-400'
                                    }`}>
                                    {index + 1}
                                </div>

                                <div className="flex items-center gap-3">
                                    {leader.profilePictureUrl ? (
                                        <img src={leader.profilePictureUrl} alt={leader.username} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                            <User size={20} />
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-gray-800">{leader.username}</p>
                                        <p className="text-xs text-gray-500">{leader.totalWorkouts} workouts</p>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="font-bold text-blue-600">{leader.totalDurationMinutes} mins</p>
                                <p className="text-xs text-gray-400">Total Duration</p>
                            </div>
                        </div>
                    ))}

                    {leaders.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No data available yet. Be the first to log a workout!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
