import { useState } from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import type React from 'react';
import type { TopArtist } from '../../types/analytics.types';

interface ArtistStatsChartProps {
    artists: TopArtist[];
    isLoading?: boolean;
}

type ChartViewOption = 'plays' | 'tracks';

const ArtistStatsChart: React.FC<ArtistStatsChartProps> = ({ artists, isLoading = false }) => {
    const [chartView, setChartView] = useState<ChartViewOption>('plays');

    const getButtonClass = (option: ChartViewOption) =>
        chartView === option
            ? 'shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800'
            : 'text-gray-500 dark:text-gray-400';

    const options: ApexOptions = {
        legend: {
            show: false,
        },
        colors: ['#465FFF', '#9CB9FF'],
        chart: {
            fontFamily: 'Outfit, sans-serif',
            height: 310,
            type: 'area',
            toolbar: {
                show: false,
            },
        },
        stroke: {
            curve: 'smooth',
            width: [2, 2],
        },
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
            },
        },
        markers: {
            size: 0,
            strokeColors: '#fff',
            strokeWidth: 2,
            hover: {
                size: 6,
            },
        },
        grid: {
            xaxis: {
                lines: {
                    show: false,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            enabled: true,
        },
        xaxis: {
            type: 'category',
            categories: artists.map((a) =>
                a.name.length > 10 ? a.name.substring(0, 10) + '…' : a.name,
            ),
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                style: {
                    fontSize: '11px',
                    colors: '#6B7280',
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: '12px',
                    colors: ['#6B7280'],
                },
                formatter: (val: number) => {
                    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
                    return String(Math.round(val));
                },
            },
            title: {
                text: '',
                style: {
                    fontSize: '0px',
                },
            },
        },
    };

    const series =
        chartView === 'plays'
            ? [
                {
                    name: 'Total Plays',
                    data: artists.map((a) => a.totalPlays),
                },
                {
                    name: 'Track Count',
                    data: artists.map((a) => a.trackCount),
                },
            ]
            : [
                {
                    name: 'Track Count',
                    data: artists.map((a) => a.trackCount),
                },
            ];

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 animate-pulse">
                <div className="flex justify-between mb-6">
                    <div>
                        <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
                    </div>
                    <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                </div>
                <div className="h-[310px] bg-gray-100 dark:bg-gray-800 rounded-lg" />
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                <div className="w-full">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Artist Performance
                    </h3>
                    <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
                        Top artists by plays and track contribution
                    </p>
                </div>
                <div className="flex items-center gap-3 sm:justify-end">
                    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
                        <button
                            onClick={() => setChartView('plays')}
                            className={`px-3 py-2 font-medium rounded-md text-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass('plays')}`}
                        >
                            Plays
                        </button>
                        <button
                            onClick={() => setChartView('tracks')}
                            className={`px-3 py-2 font-medium rounded-md text-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass('tracks')}`}
                        >
                            Tracks
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-full overflow-x-auto custom-scrollbar">
                <div className="min-w-[600px] xl:min-w-full">
                    <Chart options={options} series={series} type="area" height={310} />
                </div>
            </div>
        </div>
    );
};

export default ArtistStatsChart;
