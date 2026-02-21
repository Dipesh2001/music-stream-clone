import { useAuth } from "@/hooks/useAuth";
import { getAccessToken } from "@/utils/auth";
import { useEffect, useState } from "react";

// TEMP: remove after auth verification
export function AuthStatusBanner() {
    const { isAuthenticated, user } = useAuth();
    const [tokenPresent, setTokenPresent] = useState(false);

    // Update live
    useEffect(() => {
        const checkToken = () => {
            setTokenPresent(!!getAccessToken());
        };
        checkToken();
        const interval = setInterval(checkToken, 1000); // Check every second, cheap and effective
        return () => clearInterval(interval);
    }, [isAuthenticated]);

    return (
        <div className="fixed top-0 left-0 z-[9999] w-full bg-black/80 text-white text-xs p-1 px-4 flex justify-between items-center font-mono">
            <span>Auth Status Banner:</span>
            <span className={isAuthenticated ? "text-green-400" : "text-red-400"}>
                Authenticated: {isAuthenticated ? "YES" : "NO"}
            </span>
            <span>Email: {user?.email || "N/A"}</span>
            <span className={tokenPresent ? "text-green-400" : "text-red-400"}>
                Access token present: {tokenPresent ? "YES" : "NO"}
            </span>
        </div>
    );
}
