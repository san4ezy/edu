import React from "react";
import './App.css'
import {Routes, Route, Link} from 'react-router-dom';
import HomePage from './pages/Home';
import ProfilePage from './pages/Profile';
import NotFoundPage from './pages/NotFound';
import LoginPage from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import { useAuth } from "./context/AuthContext.tsx";

function App() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="App">
      <h1>EDU</h1>
      <div className="card">

          <nav>
              |{' '}
              <Link to="/">Home</Link> |{' '}
              <Link to="/profile">Profile</Link> |{' '}
              {isAuthenticated ? (
                <Link to="/" onClick={logout}>Logout</Link>
              ) : (
                <Link to="/login">Login</Link>
              )} |{' '}
          </nav>

          <Routes>
              {/* PUBLIC */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* PRIVATE */}
              <Route
                  path="/profile"
                  element={
                    <PrivateRoute element={<ProfilePage />} />
                  }
              />

              {/* Catch all 404 */}
              <Route path="*" element={<NotFoundPage />} />
          </Routes>

      </div>
    </div>
  )
}

export default App;
