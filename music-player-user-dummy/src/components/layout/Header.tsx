import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Music2, Search } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { Input } from "@/components/ui/input";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 glass px-4 md:px-6 py-3 flex items-center justify-between gap-4">
      {/* App Logo visible on mobile */}
      <div className="flex items-center gap-2 md:hidden">
        <Music2 className="h-6 w-6 text-primary" />
      </div>

      {/* Search Input Placeholder */}
      <div className="flex-1 max-w-sm relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="What do you want to listen to?"
          className="w-full pl-9 bg-secondary/50 border-0 rounded-full h-10 focus-visible:ring-1 focus-visible:ring-primary/50"
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
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
