import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 glass px-4 md:px-6 py-3 flex items-center justify-between">
      <div />
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium hidden sm:block">{user.name}</span>
            </div>
            <button onClick={() => { logout(); navigate("/"); }} className="p-2 rounded-full hover:bg-secondary text-muted-foreground">
              <LogOut className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button onClick={() => navigate("/login")} className="px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90">
            Log In
          </button>
        )}
      </div>
    </header>
  );
}
