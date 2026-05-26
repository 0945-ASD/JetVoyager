import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import ManageTours from './pages/ManageTours';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import AdminDashboard from './pages/AdminDashboard';
import AgentDashboard from './pages/AgentDashboard';
import CreateTrip from './pages/CreateTrip';
import TripPlanner from './pages/TripPlanner';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            {/* Public Access Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />

            {/* Protected Traveler Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['traveler', 'agent']}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hotels"
              element={
                <ProtectedRoute allowedRoles={['traveler']}>
                  <Hotels />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hotels/:id"
              element={
                <ProtectedRoute allowedRoles={['traveler']}>
                  <HotelDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-tours"
              element={
                <ProtectedRoute allowedRoles={['traveler']}>
                  <ManageTours />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips"
              element={
                <ProtectedRoute allowedRoles={['traveler']}>
                  <CreateTrip />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips/:id"
              element={
                <ProtectedRoute allowedRoles={['traveler']}>
                  <TripPlanner />
                </ProtectedRoute>
              }
            />

            {/* Protected Hotel Agent Routes */}
            <Route
              path="/agent-dashboard"
              element={
                <ProtectedRoute allowedRoles={['agent']}>
                  <AgentDashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected Administrator Routes */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Global Redirect Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
