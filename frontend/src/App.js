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
import KnockoutResultsPage from './components/KnockoutResultsPage';
import KnockoutSelectionsPage from './components/KnockoutSelectionsPage';
import FixturesTabs from './components/FixturesTabs';
import StandingsPage from './components/StandingsPage';
import KnockoutBracket from './components/KnockoutBracket';

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
        <Navbar />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<NewHomepage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/overall-leaderboard" element={<OverallLeaderboard />} />

          {/* Knockout selections: logged-in users only */}
          <Route
            path="/knockout"
            element={
              <ProtectedRoute>
                <KnockoutSelectionsPage />
              </ProtectedRoute>
            }
          />

          {/* Dashboard: any logged-in user */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route path="/fixtures" element={<FixturesTabs />} />
          <Route path="/standings" element={<StandingsPage />} />
          <Route path="/bracket" element={<KnockoutBracket />} />

          {/* Teams selection */}
          <Route
            path="/teams"
            element={
              <ProtectedRoute>
                <TeamsSelectionPage />
              </ProtectedRoute>
            }
          />

          {/* Results entry: only Admin */}
          <Route
            path="/results"
            element={
              <ProtectedRoute requiredRole="admin">
                <ResultsEntryPage />
              </ProtectedRoute>
            }
          />

          <Route
  path="/knockout-results"
  element={<KnockoutResultsPage />}
/>

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminUsers />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
