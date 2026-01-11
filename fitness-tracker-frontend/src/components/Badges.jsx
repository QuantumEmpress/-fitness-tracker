import React, { useState, useEffect } from 'react';
import badgeService from '../services/badgeService';
import { Award, Star, Zap, Clock, Calendar } from 'lucide-react';

const Badges = () => {
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const response = await badgeService.getMyBadges();
                setBadges(response.data);
            } catch (error) {
                console.error("Failed to fetch badges", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBadges();
    }, []);

    const getBadgeIcon = (type) => {
        if (type.includes('WORKOUT')) return <Zap size={24} className="text-yellow-500" />;
        if (type.includes('EARLY') || type.includes('NIGHT')) return <Clock size={24} className="text-blue-500" />;
        if (type.includes('WEEKEND')) return <Calendar size={24} className="text-green-500" />;
        return <Star size={24} className="text-purple-500" />;
    };

    if (loading) return <div className="p-4 text-center">Loading achievements...</div>;

    if (badges.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <Award size={48} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-semibold text-gray-700">No Badges Yet</h3>
                <p className="text-gray-500">Complete workouts to earn your first badge!</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Award className="text-yellow-500" />
                Achievements
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {badges.map((badge) => (
                    <div key={badge.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="bg-white p-2 rounded-full shadow-sm">
                            {getBadgeIcon(badge.badgeType)}
                        </div>
                        <div>
                            <p className="font-bold text-gray-800 text-sm">{badge.badgeType.replace(/_/g, ' ')}</p>
                            <p className="text-xs text-gray-500">
                                {new Date(badge.earnedAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Badges;
