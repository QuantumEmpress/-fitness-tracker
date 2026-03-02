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
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex items-end justify-around">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex flex-col justify-end w-full px-2">
                        <Skeleton width="100%" height={['60px', '140px', '90px', '160px', '100px'][i - 1]} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardSkeleton;
