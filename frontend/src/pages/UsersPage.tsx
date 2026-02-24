import { useState } from 'react';
import { useGetAllUsersQuery, useUpdateUserStatusMutation } from '../store/api/userApi';
import { DataTable } from '../components/table/DataTable';
import type { ColumnDefinition, TableAction } from '../components/table/Table.types';
import type { User } from '../types/user.types';
import PageMeta from '../components/common/PageMeta';

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: usersResponse, isLoading } = useGetAllUsersQuery({ search: searchTerm });
  const [updateUserStatus, { isLoading: isUpdating }] = useUpdateUserStatusMutation();

  const users = usersResponse?.data || [];

  const handleToggleStatus = async (user: User) => {
    try {
      await updateUserStatus({ id: user._id, isActive: !user.isActive }).unwrap();
      // Refetch is handled by invalidatesTags string in API
    } catch (error) {
      console.error('Failed to update user status', error);
    }
  };

  const columns: ColumnDefinition<User>[] = [
    {
      header: 'User',
      accessor: 'name',
      render: (user) => (
        <div className="flex items-center gap-3">
          <img
            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {user.name}
            </div>
            <div className="text-sm text-gray-500">
              {user.email}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (user) => (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${user.role === 'admin'
          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
          }`}>
          {user.role}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'isActive',
      render: (user) => (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${user.isActive
          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }`}>
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      header: 'Joined',
      accessor: 'createdAt',
      render: (user) => (
        <span>{new Date(user.createdAt).toLocaleDateString()}</span>
      )
    }
  ];

  const actions: TableAction<User>[] = [
    {
      label: 'Toggle Status',
      onClick: handleToggleStatus,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      className: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
      disabled: () => isUpdating
    }
  ];

  return (
    <>
      <PageMeta title="Manage Users" description="View and manage user accounts" />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Users
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage user accounts and permissions
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="w-full sm:w-96 relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <DataTable
            data={users}
            columns={columns}
            actions={actions}
            loading={isLoading}
            emptyMessage="No users found"
            keyAccessor="_id"
          />
        </div>
      </div>
    </>
  );
};

export default UsersPage;
