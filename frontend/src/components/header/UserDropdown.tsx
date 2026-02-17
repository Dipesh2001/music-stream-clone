import React from 'react';

const UserDropdown: React.FC = () => {
  return (
    <div className="relative">
      {/* Placeholder for User Dropdown */}
      <button className="flex items-center gap-4">
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-gray-800 dark:text-white">Admin User</span>
          <span className="block text-xs font-medium text-gray-500 dark:text-gray-400">Administrator</span>
        </span>
        <span className="h-12 w-12 rounded-full">
          <img src="https://via.placeholder.com/48x48" alt="User" className="h-full w-full rounded-full object-cover" />
        </span>
      </button>
      {/* Dropdown Content Here */}
    </div>
  );
};

export default UserDropdown;
