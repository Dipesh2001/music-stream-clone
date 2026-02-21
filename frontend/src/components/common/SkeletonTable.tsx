// frontend/src/components/common/SkeletonTable.tsx
import React from 'react';

interface SkeletonTableProps {
  rows?: number; // Number of skeleton rows
  cols?: number; // Number of skeleton columns
  className?: string; // Additional Tailwind CSS classes for the table container
}

const SkeletonTable: React.FC<SkeletonTableProps> = ({ rows = 5, cols = 4, className = '' }) => {
  const headerCells = Array.from({ length: cols }, (_, i) => (
    <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
    </th>
  ));

  const bodyRows = Array.from({ length: rows }, (_, rowIndex) => (
    <tr key={rowIndex}>
      {Array.from({ length: cols }, (_, colIndex) => (
        <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 bg-gray-200 rounded"></div>
        </td>
      ))}
    </tr>
  ));

  return (
    <div className={`animate-pulse overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg ${className}`}>
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>{headerCells}</tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {bodyRows}
        </tbody>
      </table>
    </div>
  );
};

export default SkeletonTable;
