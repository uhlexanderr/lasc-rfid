import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Profile = () => {
  const { admin, changePassword, logout } = useAuth();
  const navigate = useNavigate();
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('Please fill in all password fields');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
    
    if (result.success) {
      setSuccess(result.message);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  if (!admin) {
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

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          {/* Profile Information Card */}
          <div className="card shadow mb-4">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <PersonIcon className="me-2" />
                Admin Profile
              </h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 text-center mb-3">
                  <div className="bg-secondary rounded-circle d-inline-flex align-items-center justify-content-center" 
                       style={{ width: '100px', height: '100px' }}>
                    <PersonIcon style={{ fontSize: '3rem', color: 'white' }} />
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="row mb-2">
                    <div className="col-sm-4 fw-bold">Email:</div>
                    <div className="col-sm-8">{admin.email}</div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-sm-4 fw-bold">Role:</div>
                    <div className="col-sm-8">
                      <span className={`badge ${admin.role === 'super-admin' ? 'bg-danger' : 'bg-primary'}`}>
                        {admin.role}
                      </span>
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-sm-4 fw-bold">Status:</div>
                    <div className="col-sm-8">
                      <span className={`badge ${admin.isActive ? 'bg-success' : 'bg-warning'}`}>
                        {admin.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-sm-4 fw-bold">Last Login:</div>
                    <div className="col-sm-8">{formatDate(admin.lastLogin)}</div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-sm-4 fw-bold">Account Created:</div>
                    <div className="col-sm-8">{formatDate(admin.createdAt)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="card shadow">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">
                <VpnKeyIcon className="me-2" />
                Change Password
              </h5>
            </div>
            <div className="card-body">
              {error && (
                <div className='alert alert-danger' role='alert'>
                  {error}
                </div>
              )}

              {success && (
                <div className='alert alert-success' role='alert'>
                  {success}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">Current Password</label>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="form-control" 
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <div className="input-group">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="form-control" 
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      required
                    />
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </button>
                  </div>
                  <div className="form-text">Password must be at least 6 characters long</div>
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="form-control" 
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-warning w-100"
                  disabled={loading}
                >
                  {loading ? 'Changing Password...' : 'Change Password'}
                </button>
              </form>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 text-center">
            <button 
              className="btn btn-outline-primary me-2"
              onClick={() => navigate('/home')}
            >
              <HomeIcon className="me-1" />
              Back to Home
            </button>
            <button 
              className="btn btn-outline-danger"
              onClick={handleLogout}
            >
              <LogoutIcon className="me-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 