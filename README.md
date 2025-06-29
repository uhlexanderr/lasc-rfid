# MERN CRUD with Admin Authentication

A full-stack MERN application with secure admin-only authentication for student management.

## Features

- **Admin Authentication**: Secure login/logout with JWT tokens
- **Role-Based Access**: Super-admin and admin roles
- **Student Management**: CRUD operations for student records
- **Archive System**: Soft delete with archive/restore functionality
- **Protected Routes**: All student operations require admin authentication
- **Responsive UI**: Bootstrap and Material-UI components

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React with React Router
- Bootstrap for styling
- Material-UI components
- Axios for API calls

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone and Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Setup

Create a `.env` file in the server directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
```

### 3. Install Required Packages

In the server directory, install the authentication packages:

```bash
cd server
npm install bcryptjs jsonwebtoken
```

### 4. Create Super Admin Account

Run the script to create the first super-admin account:

```bash
cd server
node createSuperAdmin.js
```

This will create a super-admin with:
- Email: `admin@example.com`
- Password: `admin123`
- Role: `super-admin`

**Important**: Change these credentials in the `createSuperAdmin.js` file before running!

### 5. Start the Application

```bash
# Start the server (from server directory)
cd server
npm start

# Start the client (from client directory, in a new terminal)
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8003

## Authentication Flow

### Login Process
1. Admin enters email and password
2. Server validates credentials
3. JWT token is generated and returned
4. Token is stored in localStorage
5. User is redirected to home page

### Protected Routes
- All student management routes require authentication
- Unauthenticated users are redirected to login
- Token is automatically included in API requests

### Role System
- **Super Admin**: Can create new admin accounts and access all features
- **Admin**: Can manage students but cannot create new admin accounts

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Create new admin (super-admin only)
- `GET /api/auth/profile` - Get current admin profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### Students (Protected)
- `GET /api/students` - Get all active students
- `GET /api/students/archived` - Get archived students
- `POST /api/students` - Add new student
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student
- `PUT /api/students/:id/archive` - Archive student
- `PUT /api/students/:id/restore` - Restore archived student
- `DELETE /api/students/:id` - Permanently delete archived student

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Tokens**: Secure token-based authentication
- **Protected Routes**: Server-side route protection
- **Input Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error handling

## File Structure

```
mern-crud/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   └── App.js
│   └── package.json
├── server/
│   ├── models/
│   │   ├── Admin.js
│   │   └── Student.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   └── auth.js
│   ├── createSuperAdmin.js
│   ├── app.js
│   └── package.json
└── README.md
```

## Usage

### For Super Admins
1. Login with super-admin credentials
2. Access "Create Admin" from the user menu
3. Create new admin accounts as needed
4. Manage all student records

### For Admins
1. Login with admin credentials
2. Manage student records (add, edit, view, archive)
3. Cannot create new admin accounts

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your MONGO_URI in .env file
   - Ensure MongoDB is running

2. **JWT Token Issues**
   - Clear localStorage and login again
   - Check JWT_SECRET in .env file

3. **Package Installation Errors**
   - Delete node_modules and package-lock.json
   - Run `npm install` again

4. **Port Already in Use**
   - Change port in server/app.js
   - Kill processes using the port

### Development Tips

- Use `npm run dev` in server directory for auto-restart
- Check browser console for frontend errors
- Check server console for backend errors
- Use Postman or similar tool to test API endpoints

## Security Notes

- Change default super-admin credentials immediately
- Use strong JWT secrets in production
- Enable HTTPS in production
- Regularly update dependencies
- Monitor for security vulnerabilities

## License

This project is for educational purposes. Please ensure compliance with your organization's security policies before deploying to production. 