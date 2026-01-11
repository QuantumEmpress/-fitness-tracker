import React from 'react';

const Skeleton = ({ className = '', width, height, circle = false }) => {
    const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]';
    const shapeClasses = circle ? 'rounded-full' : 'rounded';

    const style = {
        width: width || '100%',
        height: height || '1rem',
        animation: 'shimmer 1.5s infinite',
    };

    return (
        <>
            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
            <div
                className={`${baseClasses} ${shapeClasses} ${className}`}
                style={style}
            />
        </>
    );
};

export default Skeleton;
