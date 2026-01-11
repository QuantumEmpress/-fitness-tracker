import React from 'react';
import Skeleton from './Skeleton';

const TableSkeleton = ({ rows = 5, columns = 4 }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <Skeleton width="150px" height="24px" />
            </div>
            <div className="divide-y divide-gray-200">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div key={rowIndex} className="px-6 py-4 flex items-center gap-4">
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <div key={colIndex} className="flex-1">
                                <Skeleton width={colIndex === 0 ? "80%" : "60%"} height="16px" />
                            </div>
                        ))}
                        <div className="flex gap-2">
                            <Skeleton circle width="32px" height="32px" />
                            <Skeleton circle width="32px" height="32px" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TableSkeleton;
