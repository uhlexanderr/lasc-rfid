import React, { useState, useEffect } from 'react';
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

// Placeholder for fetching student data by RFID
async function fetchStudentByRFID(rfid) {
  // TODO: Replace with actual API call
  // Simulate student data
  if (rfid === '0015281923') {
    return {
      name: 'John Doe',
      rfid: '123456',
      course: 'BSIT',
      year: '3rd Year',
      section: 'A',
      status: 'Active',
    };
  }
  return null;
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
  const PASSWORD = 'admin123'; // Hardcoded for now

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (path) => {
    setPendingPath(path);
    setPasswordDialogOpen(true);
  };

  const handleRFIDChange = (e) => {
    setRFID(e.target.value);
    setError('');
  };

  // Automatically fetch student info on RFID input (debounced)
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (rfid.trim() !== '') {
        const data = await fetchStudentByRFID(rfid);
        if (data) {
          setStudent(data);
          setError('');
  
          // Clear data after 5 seconds
          setTimeout(() => {
            setRFID('');
            setStudent(null);
          }, 5000);
        } else {
          setStudent(null);
          setError('No student found for this RFID.');
        }
      }
    }, 500); // Debounce RFID input
  
    return () => clearTimeout(delayDebounce);
  }, [rfid]);

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

  const handlePasswordSubmit = () => {
    if (password === PASSWORD) {
      setPasswordDialogOpen(false);
      setPassword('');
      setPasswordError('');
      navigate(pendingPath);
    } else {
      setPasswordError('Incorrect password.');
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
            <DialogTitle>Enter Password</DialogTitle>
            <DialogContent>
              <Input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Password"
                autoFocus
                fullWidth
              />
              {passwordError && <Typography color="error">{passwordError}</Typography>}
            </DialogContent>
            <DialogActions>
              <Button onClick={handlePasswordDialogClose}>Cancel</Button>
              <Button onClick={handlePasswordSubmit} variant="contained">
                Submit
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
          sx={{ fontSize: 32, input: { fontSize: 32, py: 2 }, mb: 3 }}
        />
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {student && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
            <img
              src={process.env.PUBLIC_URL + '/profile.png'}
              alt="Student"
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: 16,
                border: '3px solid #1976d2',
              }}
            />
            <Typography variant="h6">Student Details</Typography>
            <Typography>Name: {student.name}</Typography>
            <Typography>RFID: {student.rfid}</Typography>
            <Typography>Course: {student.course}</Typography>
            <Typography>Year: {student.year}</Typography>
            <Typography>Section: {student.section}</Typography>
            <Typography>Status: {student.status}</Typography>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default MainPage;