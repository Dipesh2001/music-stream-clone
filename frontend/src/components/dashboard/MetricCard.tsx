import type React from 'react';
import { useNavigate } from 'react-router-dom';

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    badge?: {
        value: string;
        direction: 'up' | 'down';
    };
    navigateTo: string;
    isLoading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    icon,
    badge,
    navigateTo,
    isLoading = false,
}) => {
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800" />
                <div className="flex items-end justify-between mt-5">
                    <div>
                        <div className="h-3.5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-7 w-14 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
                    </div>
                    <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={() => navigate(navigateTo)}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 cursor-pointer hover:shadow-lg hover:border-brand-200 dark:hover:border-brand-800 transition-all duration-300 group"
        >
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800 group-hover:bg-brand-50 dark:group-hover:bg-brand-500/10 transition-colors">
                {icon}
            </div>

            <div className="flex items-end justify-between mt-5">
                <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {title}
                    </span>
                    <h4 className="mt-2 font-bold text-gray-800 text-2xl dark:text-white/90">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </h4>
                </div>
                {badge && (
                    <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.direction === 'up'
                                ? 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500'
                                : 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500'
                            }`}
                    >
                        {badge.direction === 'up' ? (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path
                                    d="M5.70141 1.33683C5.83885 1.18084 6.0401 1.08243 6.26435 1.08243L6.26556 1.08243C6.45773 1.08219 6.64998 1.15535 6.79664 1.30191L9.79679 4.29924C10.0898 4.59203 10.0899 5.0669 9.79714 5.3599C9.50435 5.6529 9.02948 5.65306 8.73648 5.36027L6.91435 3.54004V10.5C6.91435 10.9142 6.57856 11.25 6.16435 11.25C5.75013 11.25 5.41435 10.9142 5.41435 10.5V3.54442L3.59679 5.36025C3.3038 5.65305 2.82893 5.6529 2.53613 5.35992C2.24333 5.06693 2.24348 4.59206 2.53646 4.29926L5.70141 1.33683Z"
                                    fill="currentColor"
                                />
                            </svg>
                        ) : (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path
                                    d="M5.36816 10.6632C5.5056 10.8192 5.70686 10.9176 5.9311 10.9176L5.93226 10.9176C6.12445 10.9178 6.31671 10.8447 6.46339 10.6981L9.46354 7.70076C9.75654 7.40797 9.75669 6.9331 9.4639 6.6401C9.17112 6.34711 8.69624 6.34694 8.40324 6.63973L6.6811 8.36V1.5C6.6811 1.08579 6.34531 0.75 5.9311 0.75C5.51688 0.75 5.1811 1.08579 5.1811 1.5V8.3556L3.46354 6.63975C3.17055 6.34695 2.69568 6.3471 2.40288 6.64009C2.11008 6.93307 2.11023 7.40794 2.40321 7.70075L5.36816 10.6632Z"
                                    fill="currentColor"
                                />
                            </svg>
                        )}
                        {badge.value}
                    </span>
                )}
            </div>
        </div>
    );
};

export default MetricCard;
