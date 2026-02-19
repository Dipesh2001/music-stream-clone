import React from "react";
import Label from "./Label";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { label: string; value: string | number }[];
}

const Select: React.FC<SelectProps> = ({ label, error, options, className = "", ...props }) => {
    return (
        <div className="w-full">
            {label && <Label htmlFor={props.id}>{label}</Label>}
            <div className="relative">
                <select
                    {...props}
                    className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-3 dark:bg-gray-900 dark:text-white/90 bg-transparent text-gray-800 ${error
                            ? "border-red-500 focus:border-red-300 focus:ring-red-500/20"
                            : "border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700"
                        } ${className} ${props.disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : ""}`}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 fill-current text-gray-400" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                </div>
            </div>
            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default Select;
