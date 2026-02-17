import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AlbumsPage from './pages/AlbumsPage';
import TracksPage from './pages/TracksPage';
import UsersPage from './pages/UsersPage';
import ArtistList from './pages/artists/ArtistList'; // Import ArtistList
import ArtistForm from './pages/artists/ArtistForm'; // Import ArtistForm
import AppLayout from './layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import { Role } from './types/auth.types'; // Import Role enum

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
            <Route path="artists" element={<ArtistList />} /> {/* Use ArtistList */}
            <Route path="artists/new" element={<ArtistForm />} /> {/* Add new artist route */}
            <Route path="artists/:id/edit" element={<ArtistForm />} /> {/* Edit artist route */}
            <Route path="albums" element={<AlbumsPage />} />
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
