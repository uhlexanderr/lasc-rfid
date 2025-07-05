import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Breadcrumb from './components/Breadcrumb';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import AddData from './components/AddData';
import EditData from './components/EditData';
import ViewData from './components/ViewData';
import Archive from './components/Archive';
import MainPage from './components/MainPage';
import Admins from './components/Admins';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (redirects to home if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

// Super Admin Route Component (only allows super-admin access)
const SuperAdminRoute = ({ children }) => {
  const { isAuthenticated, loading, admin } = useAuth();

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (admin?.role !== 'super-admin') {
    return <Navigate to="/home" replace />;
  }

  return children;
};

function AppRoutes() {
  const location = useLocation();
  const isMainPage = location.pathname === '/main';
  return (
    <>
      {!isMainPage && <Navbar />}
      {!isMainPage && <Breadcrumb />}
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/register" element={
          <ProtectedRoute>
            <Register />
          </ProtectedRoute>
        } />
        <Route path="/adddata" element={
          <ProtectedRoute>
            <AddData />
          </ProtectedRoute>
        } />
        <Route path="/editdata/:id" element={
          <ProtectedRoute>
            <EditData />
          </ProtectedRoute>
        } />
        <Route path="/edit/:id" element={
          <ProtectedRoute>
            <EditData />
          </ProtectedRoute>
        } />
        <Route path="/viewdata/:id" element={
          <ProtectedRoute>
            <ViewData />
          </ProtectedRoute>
        } />
        <Route path="/view/:id" element={
          <ProtectedRoute>
            <ViewData />
          </ProtectedRoute>
        } />
        <Route path="/archives" element={
          <ProtectedRoute>
            <Archive />
          </ProtectedRoute>
        } />
        <Route path="/main" element={
          <ProtectedRoute>
            <MainPage isMainPage />
          </ProtectedRoute>
        } />
        <Route path="/admins" element={
          <SuperAdminRoute>
            <Admins />
          </SuperAdminRoute>
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
