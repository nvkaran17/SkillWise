import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import FileReader from './components/FileReader';
import QuizPage from './components/QuizPage';
import ChatMentor from './components/ChatMentor';

import RequireAuth from './components/RequireAuth';
import PublicOnlyRoute from './components/PublicOnlyRoute';
import AuthPage from './components/AuthPage';

import { AuthProvider, useAuth } from './context/AuthContext';

function NavBar() {
  const { user, logout } = useAuth();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand text-white" to="/">SkillWise</Link>
      <div className="ms-auto d-flex gap-2">
        {user ? (
          <>
            <span className="navbar-text text-white small me-2">{user.email}</span>
            <button className="btn btn-outline-light btn-sm" onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/auth" className="btn btn-primary btn-sm">Login / Sign Up</Link>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          {/* Auth-only when logged OUT */}
          <Route path="/auth" element={
            <PublicOnlyRoute>
              <AuthPage />
            </PublicOnlyRoute>
          } />

          {/* Protected routes */}
          <Route path="/" element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } />
          <Route path="/chat" element={
            <RequireAuth>
              <ChatMentor />
            </RequireAuth>
          } />
          <Route path="/file" element={
            <RequireAuth>
              <FileReader />
            </RequireAuth>
          } />
          <Route path="/quiz" element={
            <RequireAuth>
              <QuizPage />
            </RequireAuth>
          } />

          {/* Fallback */}
          <Route path="*" element={<div className="mt-5 text-center">Not found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

