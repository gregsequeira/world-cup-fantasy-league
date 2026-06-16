import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Signup from './components/Signup';
import Navbar from './components/Navbar';
import DashboardPage from './components/DashboardPage';
import ResultsEntryPage from './components/ResultsEntryPage';
import ProtectedRoute from './components/ProtectedRoute';
import TeamsSelectionPage from './components/TeamsSelectionPage';
import OverallLeaderboard from './components/OverallLeaderboard';
import AdminDashboard from './components/AdminDashboard';
import AdminUsers from './components/AdminUsers';
import NewHomepage from './components/NewHomepage';

// Optional: create a custom Material-UI theme for consistent styling
const theme = createTheme({
  palette: {
    primary: {
      main: '#7FC8A9', // pastel green
    },
    secondary: {
      main: '#66bb6a', // soft green accent
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* Navbar is always visible */}
        <Navbar />

        {/* Page Routes */}
        <Routes>
  {/* Public routes */}
  {/* Old homepage */}
  {/*<Route path="/" element={<Homepage />} /> */}

  {/* New homepage */}
  <Route path="/" element={<NewHomepage />} />

  <Route path="/signup" element={<Signup />} />
  <Route path="/overall-leaderboard" element={<OverallLeaderboard />} />

  {/* Dashboard: any logged-in user */}
  <Route path="/dashboard" element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } />

  {/* Teams selection: open to all logged-in users (no verification required) */}
  <Route path="/teams" element={
    <ProtectedRoute>
      <TeamsSelectionPage />
    </ProtectedRoute>
  } />

  {/* Results entry: only Admin */}
  <Route path="/results" element={
    <ProtectedRoute requiredRole="admin">
      <ResultsEntryPage />
    </ProtectedRoute>
  } />

  {/* Admin routes: only Admin */}
  <Route path="/admin" element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  } />
  <Route path="/admin/users" element={
    <ProtectedRoute requiredRole="admin">
      <AdminUsers />
    </ProtectedRoute>
  } />

  {/* Future routes */}
  {/* <Route path="/profile" element={<Profile />} /> */}
  {/* <Route path="/leaderboard" element={<Leaderboard />} /> */}
</Routes>

      </Router>
    </ThemeProvider>
  );
}

export default App;
