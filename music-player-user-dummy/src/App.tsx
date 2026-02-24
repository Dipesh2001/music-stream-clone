import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { LibraryProvider } from "@/context/LibraryContext";
import { PlayerProvider } from "@/context/PlayerContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { AuthStatusBanner } from "@/components/auth/AuthStatusBanner";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Library from "./pages/Library";
import LikedSongs from "./pages/LikedSongs";
import PlaylistDetails from "./pages/PlaylistDetails";
import AlbumDetails from "./pages/AlbumDetails";
import ArtistDetails from "./pages/ArtistDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LibraryProvider>
        <PlayerProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              {/* TEMP: remove after auth verification */}
              <AuthStatusBanner />
              <Routes>
                {/* Public */}
                <Route path="/" element={<Landing />} />
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                </Route>

                {/* Protected (with app layout) */}
                <Route element={<AppLayout />}>
                  <Route path="/home" element={<Home />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/library" element={<Library />} />
                  <Route path="/library/liked" element={<LikedSongs />} />
                  <Route path="/playlist/:id" element={<PlaylistDetails />} />
                  <Route path="/album/:id" element={<AlbumDetails />} />
                  <Route path="/artist/:id" element={<ArtistDetails />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>

          </TooltipProvider>
        </PlayerProvider>
      </LibraryProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
