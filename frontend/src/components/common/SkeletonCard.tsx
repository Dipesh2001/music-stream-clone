// frontend/src/components/common/SkeletonCard.tsx
import React from 'react';

interface SkeletonCardProps {
  count?: number; // Number of skeleton cards to render
  className?: string; // Additional Tailwind CSS classes
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ count = 1, className = '' }) => {
  const cards = Array.from({ length: count }, (_, i) => (
    <div key={i} className={`animate-pulse rounded-lg bg-gray-200 shadow-md p-4 ${className}`}>
      <div className="h-48 w-full rounded-md bg-gray-300 mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  ));

  return <>{cards}</>;
};

export default SkeletonCard;
