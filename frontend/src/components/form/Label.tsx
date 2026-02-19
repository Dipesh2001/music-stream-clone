import React from "react";

interface LabelProps {
    htmlFor?: string;
    children: React.ReactNode;
    className?: string;
}

const Label: React.FC<LabelProps> = ({ htmlFor, children, className = "" }) => {
    return (
        <label
            htmlFor={htmlFor}
            className={`block mb-2 text-sm font-medium text-gray-700 dark:text-white/90 ${className}`}
        >
            {children}
        </label>
    );
};

export default Label;
