import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './routes/AdminRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SEO from './components/SEO';
import Leaderboard from './pages/Leaderboard';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Exercises from './pages/Exercises';
import Workouts from './pages/Workouts';
import Goals from './pages/Goals';
import AdminDashboard from './pages/AdminDashboard';
import ProgressPhotos from './pages/ProgressPhotos';
import Calculators from './pages/Calculators';
import AuditLogs from './pages/AuditLogs';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<><SEO title="Login - Fitness Tracker" /><Login /></>} />
        <Route path="/signup" element={<><SEO title="Sign Up - Fitness Tracker" /><Signup /></>} />

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layout><SEO title="Dashboard - Fitness Tracker" /><Dashboard /></Layout>} />
          <Route path="/dashboard" element={<Layout><SEO title="Dashboard - Fitness Tracker" /><Dashboard /></Layout>} />
          <Route path="/profile" element={<Layout><SEO title="My Profile - Fitness Tracker" /><Profile /></Layout>} />
          <Route path="/exercises" element={<Layout><SEO title="Exercises - Fitness Tracker" /><Exercises /></Layout>} />
          <Route path="/workouts" element={<Layout><SEO title="Workouts - Fitness Tracker" /><Workouts /></Layout>} />
          <Route path="/goals" element={<Layout><SEO title="My Goals - Fitness Tracker" /><Goals /></Layout>} />
          <Route path="/leaderboard" element={<Layout><SEO title="Leaderboard - Fitness Tracker" /><Leaderboard /></Layout>} />
          <Route path="/progress-photos" element={<Layout><SEO title="Progress Photos - Fitness Tracker" /><ProgressPhotos /></Layout>} />
          <Route path="/calculators" element={<Layout><SEO title="Fitness Calculators - Fitness Tracker" /><Calculators /></Layout>} />

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
            <Route path="/audit-logs" element={<Layout><AuditLogs /></Layout>} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#334155',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            borderRadius: '1rem',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#8b5cf6',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}

export default App;
