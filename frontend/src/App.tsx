import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import ArtistList from './pages/artists/ArtistList';
import ArtistDetails from './pages/artists/ArtistDetails';
import ArtistForm from './pages/artists/ArtistForm';
import AlbumList from './pages/albums/AlbumList';
import AlbumDetails from './pages/albums/AlbumDetails';
import AlbumForm from './pages/albums/AlbumForm';
import TrackList from './pages/tracks/TrackList';
import TrackForm from './pages/tracks/TrackForm';
import PlaylistList from './pages/playlists/PlaylistList';
import PlaylistDetails from './pages/playlists/PlaylistDetails';
import PlaylistForm from './pages/playlists/PlaylistForm';
import AppLayout from './layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { Role } from './types/auth.types';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={[Role.ADMIN, Role.SUPER_ADMIN, Role.USER]} />}>
          <Route path="/" element={<AppLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />

            <Route path="artists" element={<ArtistList />} />
            <Route path="artists/:id" element={<ArtistDetails />} />
            <Route path="artists/new" element={<ArtistForm />} />
            <Route path="artists/:id/edit" element={<ArtistForm />} />

            <Route path="albums" element={<AlbumList />} />
            <Route path="albums/:id" element={<AlbumDetails />} />
            <Route path="albums/new" element={<AlbumForm />} />
            <Route path="albums/:id/edit" element={<AlbumForm />} />

            <Route path="tracks" element={<TrackList />} />
            <Route path="tracks/new" element={<TrackForm />} />
            <Route path="tracks/:id/edit" element={<TrackForm />} />

            <Route path="playlists" element={<PlaylistList />} />
            <Route path="playlists/new" element={<PlaylistForm />} />
            <Route path="playlists/:id" element={<PlaylistDetails />} />
            <Route path="playlists/:id/edit" element={<PlaylistForm />} />

            <Route path="users" element={<UsersPage />} />

            {/* Default route for AppLayout, redirect to dashboard if authenticated */}
            <Route index element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        {/* Catch-all for unknown routes, redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
