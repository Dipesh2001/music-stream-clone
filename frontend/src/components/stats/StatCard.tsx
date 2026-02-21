import type React from 'react';
import { useNavigate } from 'react-router-dom';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    trendDirection?: 'up' | 'down' | 'neutral';
    accentColor?: string;
    isLoading?: boolean;
    navigateTo?: string;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    trend,
    trendDirection = 'neutral',
    accentColor = 'brand',
    isLoading = false,
    navigateTo,
}) => {
    const navigate = useNavigate();
    const trendColors: Record<string, string> = {
        up: 'text-green-500',
        down: 'text-red-500',
        neutral: 'text-gray-400',
    };

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                </div>
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mt-3" />
            </div>
        );
    }

    return (
        <div
            onClick={() => navigateTo && navigate(navigateTo)}
            className={`rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-theme-xs hover:shadow-lg transition-shadow duration-300 group ${navigateTo ? 'cursor-pointer hover:border-brand-200 dark:hover:border-brand-800' : ''
                }`}
        >
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {title}
                </p>
                <div
                    className={`flex items-center justify-center w-12 h-12 rounded-xl bg-${accentColor}-500/10 text-${accentColor}-600 group-hover:scale-110 transition-transform duration-300`}
                >
                    {icon}
                </div>
            </div>
            <div className="mt-3">
                <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </h3>
                {trend && (
                    <p className={`text-xs font-semibold mt-1.5 ${trendColors[trendDirection]}`}>
                        {trendDirection === 'up' && '↑ '}
                        {trendDirection === 'down' && '↓ '}
                        {trend}
                    </p>
                )}
            </div>
        </div>
    );
};

export default StatCard;
