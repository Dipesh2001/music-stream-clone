import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TracksPage from './pages/TracksPage';
import UsersPage from './pages/UsersPage';
import ArtistList from './pages/artists/ArtistList';
import ArtistForm from './pages/artists/ArtistForm';
import AlbumList from './pages/albums/AlbumList'; // Import AlbumList
import AlbumForm from './pages/albums/AlbumForm'; // Import AlbumForm
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
            <Route path="artists/new" element={<ArtistForm />} />
            <Route path="artists/:id/edit" element={<ArtistForm />} />
            <Route path="albums" element={<AlbumList />} /> {/* New Albums List Route */}
            <Route path="albums/new" element={<AlbumForm />} /> {/* New Add Album Route */}
            <Route path="albums/:id/edit" element={<AlbumForm />} /> {/* New Edit Album Route */}
            <Route path="tracks" element={<TracksPage />} />
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
