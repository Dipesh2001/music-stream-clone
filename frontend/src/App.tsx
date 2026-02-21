import React, { Suspense } from 'react'; // Import React and Suspense
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/error/ErrorBoundary';
import { Role } from './types/auth.types';

// Lazy load page components
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const UsersPage = React.lazy(() => import('./pages/UsersPage'));
const ArtistList = React.lazy(() => import('./pages/artists/ArtistList'));
const ArtistDetails = React.lazy(() => import('./pages/artists/ArtistDetails'));
const ArtistForm = React.lazy(() => import('./pages/artists/ArtistForm'));
const AlbumList = React.lazy(() => import('./pages/albums/AlbumList'));
const AlbumDetails = React.lazy(() => import('./pages/albums/AlbumDetails'));
const AlbumForm = React.lazy(() => import('./pages/albums/AlbumForm'));
const TrackList = React.lazy(() => import('./pages/tracks/TrackList'));
const TrackForm = React.lazy(() => import('./pages/tracks/TrackForm'));
const PlaylistList = React.lazy(() => import('./pages/playlists/PlaylistList'));
const PlaylistDetails = React.lazy(() => import('./pages/playlists/PlaylistDetails'));
const PlaylistForm = React.lazy(() => import('./pages/playlists/PlaylistForm'));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        }>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes - accessible by all authenticated users (User, Admin, Super Admin) */}
            <Route element={<ProtectedRoute allowedRoles={[Role.USER, Role.ADMIN, Role.SUPER_ADMIN]} />}>
              <Route path="/" element={<AppLayout />}>
                <Route path="dashboard" element={<DashboardPage />} />

                {/* Routes accessible by all authenticated users */}
                <Route path="artists" element={<ArtistList />} />
                <Route path="artists/:id" element={<ArtistDetails />} />
                <Route path="albums" element={<AlbumList />} />
                <Route path="albums/:id" element={<AlbumDetails />} />
                <Route path="tracks" element={<TrackList />} />
                <Route path="playlists" element={<PlaylistList />} />
                <Route path="playlists/:id" element={<PlaylistDetails />} />

                {/* Protected Routes - accessible by Admin and Super Admin */}
                <Route element={<ProtectedRoute allowedRoles={[Role.ADMIN, Role.SUPER_ADMIN]} />}>
                  <Route path="artists/new" element={<ArtistForm />} />
                  <Route path="artists/:id/edit" element={<ArtistForm />} />

                  <Route path="albums/new" element={<AlbumForm />} />
                  <Route path="albums/:id/edit" element={<AlbumForm />} />

                  <Route path="tracks/new" element={<TrackForm />} />
                  <Route path="tracks/:id/edit" element={<TrackForm />} />

                  <Route path="playlists/new" element={<PlaylistForm />} />
                  <Route path="playlists/:id/edit" element={<PlaylistForm />} />

                  <Route path="users" element={<UsersPage />} />
                </Route>

                {/* Default route for AppLayout, redirect to dashboard if authenticated */}
                <Route index element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Route>

            {/* Catch-all for unknown routes, redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
