import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authAPI } from './services/api';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import VehicleDetailPage from './components/VehicleDetailPage';
import ValuationPage from './components/ValuationPage';
import LoginPage from './components/LoginPage';
import './App.css';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(authAPI.isAuthenticated());
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <div className="app">
        <header className="app-header">
          <div className="container">
            <div className="header-content">
              <Link to="/" className="logo">
                <h1>AutoStack</h1>
              </Link>
              <nav className="nav-menu">
                <Link to="/">Home</Link>
                <Link to="/search">Browse Vehicles</Link>
                {isAuthenticated && <Link to="/valuation">Trade-In Value</Link>}
                {isAuthenticated ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>
                      {authAPI.getCurrentUser()?.name || authAPI.getCurrentUser()?.email}
                    </span>
                    <button onClick={handleLogout} className="btn btn-secondary">
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="btn btn-primary">
                    Login
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/search"
              element={isAuthenticated ? <SearchPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/vehicles/:id"
              element={isAuthenticated ? <VehicleDetailPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/valuation"
              element={isAuthenticated ? <ValuationPage /> : <Navigate to="/login" />}
            />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <div className="container">
            <p>&copy; 2024 AutoStack. All rights reserved.</p>
            <p className="powered-by">
              Powered by CloudBees Feature Management | Built with CloudBees CI
            </p>
          </div>
        </footer>
      </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
