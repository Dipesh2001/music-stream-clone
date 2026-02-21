import { Outlet, Navigate } from "react-router-dom";
import { Music2, Loader2 } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";

export function AuthLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2">
          <Music2 className="h-10 w-10 text-primary" />
          <h1 className="text-2xl font-bold">{APP_NAME}</h1>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
