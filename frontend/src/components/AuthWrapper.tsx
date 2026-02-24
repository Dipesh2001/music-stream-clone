import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUserProfileQuery } from '../store/api/userApi';
import { setCredentials, clearCredentials, selectIsAuthenticated } from '../store/slices/authSlice';

interface AuthWrapperProps {
    children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const { data, isSuccess, isError, isLoading } = useGetUserProfileQuery(undefined, {
        skip: isAuthenticated, // Only fetch on hard reloads or initial visits where Redux is empty
    });

    const [isInitializing, setIsInitializing] = useState(!isAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) {
            if (isLoading) return;

            if (isSuccess && data?.success && data?.data) {
                dispatch(
                    setCredentials({
                        user: data.data,
                    })
                );
            } else if (isError) {
                // Failed to fetch user (e.g. no cookie or invalid cookie)
                dispatch(clearCredentials());
            }
            setIsInitializing(false);
        } else {
            setIsInitializing(false);
        }
    }, [isAuthenticated, isSuccess, isError, isLoading, data, dispatch]);

    if (isInitializing || isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500 mb-4"></div>
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthWrapper;
