import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogoutUserMutation } from '../../store/api/authApi';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/slices/authSlice';
import type { AuthUser } from '../../types/auth.types';

const UserDropdown: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();
  const user = useSelector(selectCurrentUser) as AuthUser | null;

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      toast.error('Failed to log out');
      console.error('Logout error:', err);
    }
  };

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownOpen || dropdownRef.current.contains(target as Node)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [dropdownOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-4"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-gray-800 dark:text-white">{user?.name || 'Admin User'}</span>
          <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">{user?.role || 'Administrator'}</span>
        </span>
        <span className="h-12 w-12 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=random`}
            alt="User"
            className="h-full w-full object-cover"
          />
        </span>
      </button>

      {dropdownOpen && (
        <div
          className="absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-gray-200 bg-white shadow-default dark:border-gray-800 dark:bg-gray-700"
        >
          {/* <ul className="flex flex-col gap-5 border-b border-gray-200 px-6 py-7.5 dark:border-gray-800">
            <li>
              <Link
                to="/profile"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-brand-500 lg:text-base"
              >
                My Profile
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-brand-500 lg:text-base"
              >
                Account Settings
              </Link>
            </li>
          </ul> */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-brand-500 lg:text-base"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
