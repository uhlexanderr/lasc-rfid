import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Card, Typography, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Input from '@mui/material/Input';
import { useAuth } from '../context/AuthContext';
import Skeleton from '@mui/material/Skeleton';

// Fetch student data by RFID from the database
async function fetchStudentByRFID(rfid) {
  try {
    const response = await fetch(`http://localhost:8003/api/rfid/${rfid}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Student not found
      }
      throw new Error('Failed to fetch student data');
    }
    const data = await response.json();
    return data.student;
  } catch (error) {
    console.error('Error fetching student data:', error);
    throw error;
  }
}

const MainPage = ({ isMainPage }) => {
  const [rfid, setRFID] = useState('');
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const rfidInputRef = useRef(null);
  const [imgLoading, setImgLoading] = useState(true);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (path) => {
    // Clear any existing RFID processing
    if (window.rfidTimeout) {
      clearTimeout(window.rfidTimeout);
    }
    if (window.autoClearTimeout) {
      clearTimeout(window.autoClearTimeout);
    }
    
    // Clear RFID input and any student data
    setRFID('');
    setStudent(null);
    setError('');
    
    // Remove focus from RFID input to prevent unwanted processing
    if (rfidInputRef.current) {
      rfidInputRef.current.blur();
    }
    
    // If user is already authenticated, navigate directly
    if (isAuthenticated) {
      navigate(path);
    } else {
      // If not authenticated, show login dialog
      setPendingPath(path);
      setPasswordDialogOpen(true);
    }
  };

  const handleRFIDChange = (e) => {
    setRFID(e.target.value);
    setError('');
  };

  // Handle RFID input changes with delay to wait for complete scan
  useEffect(() => {
    if (rfid.trim() !== '') {
      // Clear any existing timeout
      if (window.rfidTimeout) {
        clearTimeout(window.rfidTimeout);
      }

      // Wait for 100ms to ensure complete RFID input
      window.rfidTimeout = setTimeout(async () => {
        // Clear any existing auto-clear timeout
        if (window.autoClearTimeout) {
          clearTimeout(window.autoClearTimeout);
        }

        // Fetch student data
        try {
          const data = await fetchStudentByRFID(rfid);
          if (data) {
            setStudent(data);
            setError('');
            
            // Clear input field immediately to allow next scan
            setRFID('');
            
            // Set auto-clear timeout for 5 seconds
            window.autoClearTimeout = setTimeout(() => {
              setStudent(null);
              setError(''); // Also clear any error messages
            }, 5000);
          } else {
            setStudent(null);
            setError('No student found for this RFID.');
            // Clear input field immediately even for errors
            setRFID('');
          }
        } catch (error) {
          setStudent(null);
          setError('Error fetching student data. Please try again.');
          // Clear input field immediately even for errors
          setRFID('');
        }
      }, 100); // 100ms delay to wait for complete RFID input
    }

    // Cleanup function to clear timeouts when component unmounts
    return () => {
      if (window.rfidTimeout) {
        clearTimeout(window.rfidTimeout);
      }
      if (window.autoClearTimeout) {
        clearTimeout(window.autoClearTimeout);
      }
    };
  }, [rfid]);

  // Additional useEffect to handle auto-clear when component unmounts or student changes
  useEffect(() => {
    setImgLoading(true);
  }, [student]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError('');
  };

  const handlePasswordDialogClose = () => {
    setPasswordDialogOpen(false);
    setPassword('');
    setPasswordError('');
    setPendingPath(null);
  };

  const handlePasswordSubmit = async () => {
    if (!password.trim()) {
      setPasswordError('Password is required.');
      return;
    }

    try {
      // Use the existing login function from AuthContext
      const result = await login('admin@example.com', password);
      
      if (result.success) {
        setPasswordDialogOpen(false);
        setPassword('');
        setPasswordError('');
        // Navigate to the pending path after successful login
        if (pendingPath) {
          navigate(pendingPath);
        }
      } else {
        setPasswordError(result.message || 'Incorrect password.');
      }
    } catch (error) {
      setPasswordError('Login failed. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f5f6fa',
      }}
    >
      {isMainPage && (
        <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
          <IconButton size="large" aria-label="menu" onClick={handleMenuOpen} color="inherit">
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => handleMenuClick('/')}>Home</MenuItem>
            <MenuItem onClick={() => handleMenuClick('/archives')}>Archived</MenuItem>
            <MenuItem onClick={() => handleMenuClick('/profile')}>Profile</MenuItem>
          </Menu>
          <Dialog open={passwordDialogOpen} onClose={handlePasswordDialogClose}>
            <DialogTitle>Admin Login Required</DialogTitle>
            <DialogContent>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Please enter your admin credentials to access this feature.
              </Typography>
              <Input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                autoFocus
                fullWidth
                sx={{ mb: 1 }}
              />
              {passwordError && <Typography color="error" variant="body2">{passwordError}</Typography>}
            </DialogContent>
            <DialogActions>
              <Button onClick={handlePasswordDialogClose}>Cancel</Button>
              <Button onClick={handlePasswordSubmit} variant="contained" sx={{ backgroundColor: '#004aad', color: '#fff', '&:hover': { backgroundColor: '#00337a' } }}>
                Login
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}

      <Card
        sx={{
          p: 4,
          minWidth: 400,
          maxWidth: 500,
          boxShadow: 3,
          borderRadius: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight={700} color="primary.main">
          Main RFID Page
        </Typography>
        <TextField
          label="Tap or Enter RFID"
          value={rfid}
          onChange={handleRFIDChange}
          variant="outlined"
          autoFocus
          fullWidth
          inputRef={rfidInputRef}
          sx={{ fontSize: 32, input: { fontSize: 32, py: 2 }, mb: 3 }}
        />
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {student && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
            <Box sx={{ position: 'relative', width: 120, height: 120, mb: 2 }}>
              {imgLoading && (
                <Skeleton variant="rectangular" width={120} height={120} sx={{ position: 'absolute', top: 0, left: 0, zIndex: 1, borderRadius: '8px' }} />
              )}
              <img
                src={student.pic || process.env.PUBLIC_URL + '/profile.png'}
                alt="Student"
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #1976d2',
                  display: imgLoading ? 'none' : 'block',
                }}
                onLoad={() => setImgLoading(false)}
                onError={() => setImgLoading(false)}
              />
            </Box>
            <Typography variant="h6">Student Details</Typography>
            <Typography>Name: {student.firstName} {student.middleName} {student.lastName}</Typography>
            <Typography>RFID: {student.rfid}</Typography>
            <Typography>LRN: {student.lrn}</Typography>
            <Typography>Grade Level: {student.grlvl}</Typography>
            <Typography>School Year: {student.sy}</Typography>
            <Typography>Parent: {student.parentName}</Typography>
            <Typography>Mobile: {student.mobileNo}</Typography>
            <Typography>Address: {student.address}</Typography>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default MainPage;