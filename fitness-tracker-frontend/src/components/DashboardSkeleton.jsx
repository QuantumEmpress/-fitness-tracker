import React from 'react';
import Skeleton from './Skeleton';

const DashboardSkeleton = () => {
    return (
        <div className="space-y-8">
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <Skeleton width="60%" height="14px" className="mb-2" />
                                <Skeleton width="40%" height="28px" />
                            </div>
                            <Skeleton circle width="48px" height="48px" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart Skeleton */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <Skeleton width="150px" height="24px" className="mb-4" />
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-end gap-2">
                            <Skeleton width="60px" height={`${Math.random() * 150 + 50}px`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;
