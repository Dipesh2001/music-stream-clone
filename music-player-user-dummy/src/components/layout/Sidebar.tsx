import { Home, Search, Library, Plus, Music2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { APP_NAME } from "@/lib/constants";
import { mockPlaylists } from "@/hooks/useFetchHomeData";

const mainNav = [
  { to: "/home", icon: Home, label: "Home" },
  { to: "/search", icon: Search, label: "Search" },
  { to: "/library", icon: Library, label: "Your Library" },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 bg-card/50 border-r border-border/50 h-screen sticky top-0 flex-shrink-0">
      {/* Logo */}
      <div className="p-5 pb-2">
        <div className="flex items-center gap-2">
          <Music2 className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold tracking-tight">{APP_NAME}</span>
        </div>
      </div>

      {/* Main nav */}
      <nav className="px-3 space-y-1 mt-4">
        {mainNav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Playlists */}
      <div className="mt-6 px-3 flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Playlists</span>
          <button className="p-1 rounded hover:bg-secondary text-muted-foreground">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-1">
          {mockPlaylists.map((pl) => (
            <NavLink
              key={pl.id}
              to={`/playlist/${pl.id}`}
              className={({ isActive }) =>
                `block px-3 py-1.5 rounded-md text-sm truncate transition-colors ${isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`
              }
            >
              {pl.title}
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
}
