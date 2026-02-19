import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalendarIcon } from "../../icons";
import type { Options } from "flatpickr/dist/types/options";

type PropsType = {
    id: string;
    mode?: "single" | "multiple" | "range" | "time";
    onChange?: Options["onChange"];
    value?: string | Date;
    label?: string;
    placeholder?: string;
    className?: string;
};

export default function DatePicker({
    id,
    mode,
    onChange,
    label,
    value,
    placeholder,
    className = "",
}: PropsType) {
    const inputRef = useRef<HTMLInputElement>(null);
    const flatpickrInstance = useRef<flatpickr.Instance | null>(null);

    useEffect(() => {
        if (inputRef.current) {
            flatpickrInstance.current = flatpickr(inputRef.current, {
                mode: mode || "single",
                static: true,
                monthSelectorType: "static",
                dateFormat: "Y-m-d",
                defaultDate: value,
                onChange,
            });
        }

        return () => {
            flatpickrInstance.current?.destroy();
        };
    }, [mode, onChange, value]);

    return (
        <div className={className}>
            {label && <Label htmlFor={id}>{label}</Label>}

            <div className="relative">
                <input
                    id={id}
                    ref={inputRef}
                    placeholder={placeholder}
                    defaultValue={typeof value === 'string' ? value : undefined}
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                />

                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <CalendarIcon className="size-6" />
                </span>
            </div>
        </div>
    );
}
