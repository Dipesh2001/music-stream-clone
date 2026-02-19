import React from "react";
import Label from "./Label";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = "", ...props }) => {
    return (
        <div className="w-full">
            {label && <Label htmlFor={props.id}>{label}</Label>}
            <div className="relative">
                <input
                    {...props}
                    className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 ${error
                            ? "border-red-500 focus:border-red-300 focus:ring-red-500/20"
                            : "border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700"
                        } ${className} ${props.disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : ""}`}
                />
            </div>
            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default Input;
