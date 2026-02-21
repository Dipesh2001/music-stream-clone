import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import type React from 'react';
import type { TopTrack } from '../../types/analytics.types';

interface PlayCountBarChartProps {
    tracks: TopTrack[];
    isLoading?: boolean;
}

const PlayCountBarChart: React.FC<PlayCountBarChartProps> = ({ tracks, isLoading = false }) => {
    const options: ApexOptions = {
        colors: ['#465fff'],
        chart: {
            fontFamily: 'Outfit, sans-serif',
            type: 'bar',
            height: 250,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '50%',
                borderRadius: 6,
                borderRadiusApplication: 'end',
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 3,
            colors: ['transparent'],
        },
        xaxis: {
            categories: tracks.map((t) =>
                t.title.length > 12 ? t.title.substring(0, 12) + '…' : t.title,
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
                rotate: -45,
                rotateAlways: tracks.length > 6,
            },
        },
        legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'left',
            fontFamily: 'Outfit',
        },
        yaxis: {
            title: {
                text: undefined,
            },
            labels: {
                style: {
                    fontSize: '12px',
                    colors: ['#6B7280'],
                },
                formatter: (val: number) => {
                    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
                    return String(val);
                },
            },
        },
        grid: {
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        fill: {
            opacity: 1,
        },
        tooltip: {
            x: {
                show: true,
            },
            y: {
                formatter: (val: number) => `${val.toLocaleString()} plays`,
            },
        },
    };

    const series = [
        {
            name: 'Play Count',
            data: tracks.map((t) => t.playCount),
        },
    ];

    if (isLoading) {
        return (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 animate-pulse">
                <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                <div className="h-[250px] bg-gray-100 dark:bg-gray-800 rounded-lg" />
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Track Play Counts
                </h3>
            </div>
            <p className="text-gray-500 text-sm dark:text-gray-400 mb-2">
                Top tracks by total plays
            </p>
            <div className="max-w-full overflow-x-auto custom-scrollbar">
                <div className="-ml-5 min-w-[500px] xl:min-w-full pl-2">
                    <Chart options={options} series={series} type="bar" height={250} />
                </div>
            </div>
        </div>
    );
};

export default PlayCountBarChart;
