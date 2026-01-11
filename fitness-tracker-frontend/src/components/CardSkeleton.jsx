import React from 'react';
import Skeleton from './Skeleton';

const CardSkeleton = ({ cards = 6 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: cards }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <Skeleton width="100%" height="200px" className="rounded-none" />
                    <div className="p-4 space-y-3">
                        <Skeleton width="70%" height="20px" />
                        <Skeleton width="100%" height="14px" />
                        <Skeleton width="90%" height="14px" />
                        <div className="flex gap-2 pt-2">
                            <Skeleton width="80px" height="32px" />
                            <Skeleton width="80px" height="32px" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CardSkeleton;
