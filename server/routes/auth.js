const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');
const router = express.Router();

// Admin Register (only super-admin can create new admins)
router.post('/register', authenticateToken, async (req, res) => {
  try {
    // Check if current admin is super-admin
    if (req.admin.role !== 'super-admin') {
      return res.status(403).json({ message: 'Only super-admin can create new admin accounts' });
    }

    const { email, password, role = 'admin' } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // Create new admin
    const newAdmin = new Admin({
      email: email.toLowerCase(),
      password,
      role
    });

    await newAdmin.save();

    // Return admin data without password
    const adminData = {
      id: newAdmin._id,
      email: newAdmin.email,
      role: newAdmin.role,
      isActive: newAdmin.isActive,
      createdAt: newAdmin.createdAt
    };

    res.status(201).json({ 
      message: 'Admin created successfully', 
      admin: adminData 
    });

  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ message: 'Error creating admin account' });
  }
});

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin._id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return admin data and token
    const adminData = {
      id: admin._id,
      email: admin.email,
      role: admin.role,
      lastLogin: admin.lastLogin
    };

    res.status(200).json({
      message: 'Login successful',
      admin: adminData,
      token
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

// Get current admin profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const adminData = {
      id: req.admin._id,
      email: req.admin.email,
      role: req.admin.role,
      isActive: req.admin.isActive,
      lastLogin: req.admin.lastLogin,
      createdAt: req.admin.createdAt
    };

    res.status(200).json({ admin: adminData });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    // Verify current password
    const isCurrentPasswordValid = await req.admin.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    req.admin.password = newPassword;
    await req.admin.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
});

// Get all admins (only super-admin can access)
router.get('/admins', authenticateToken, async (req, res) => {
  try {
    // Check if current admin is super-admin
    if (req.admin.role !== 'super-admin') {
      return res.status(403).json({ message: 'Only super-admin can view all admins' });
    }

    const admins = await Admin.find({}, { password: 0 }); // Exclude password field

    // Format admin data
    const adminsData = admins.map(admin => ({
      id: admin._id,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
      lastLogin: admin.lastLogin,
      createdAt: admin.createdAt
    }));

    res.status(200).json({ admins: adminsData });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ message: 'Error fetching admins' });
  }
});

// Delete admin (only super-admin can delete other admins)
router.delete('/admins/:adminId', authenticateToken, async (req, res) => {
  try {
    // Check if current admin is super-admin
    if (req.admin.role !== 'super-admin') {
      return res.status(403).json({ message: 'Only super-admin can delete admin accounts' });
    }

    const { adminId } = req.params;

    // Prevent super-admin from deleting themselves
    if (adminId === req.admin._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    // Find the admin to delete
    const adminToDelete = await Admin.findById(adminId);
    if (!adminToDelete) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Prevent deleting other super-admins (optional security measure)
    if (adminToDelete.role === 'super-admin') {
      return res.status(400).json({ message: 'Cannot delete other super-admin accounts' });
    }

    // Delete the admin
    await Admin.findByIdAndDelete(adminId);

    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ message: 'Error deleting admin' });
  }
});

// Logout (client-side token removal, but we can track if needed)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a more advanced setup, you might want to blacklist the token
    // For now, we'll just return success and let the client remove the token
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Error during logout' });
  }
});

module.exports = router; 