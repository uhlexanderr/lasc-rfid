import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import Skeleton from '@mui/material/Skeleton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const Home = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        title: '',
        message: '',
        studentId: null
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await axios.get("http://localhost:8003/api/students");
                setStudents(res.data.students);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch students");
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const handleArchive = (studentId) => {
        setConfirmDialog({
            open: true,
            title: 'Archive Student',
            message: 'Are you sure you want to archive this student? They will be moved to the archived students list and can be restored later if needed.',
            studentId: studentId
        });
    };

    const handleConfirmArchive = async () => {
        const { studentId } = confirmDialog;
        
        try {
            await axios.put(`http://localhost:8003/api/students/${studentId}/archive`);
            // Refresh the students list
            const res = await axios.get("http://localhost:8003/api/students");
            setStudents(res.data.students);
        } catch (error) {
            console.log("Error archiving student:", error);
            alert('Failed to archive student');
        }
        
        // Close the dialog
        setConfirmDialog({
            open: false,
            title: '',
            message: '',
            studentId: null
        });
    };

    const handleCloseDialog = () => {
        setConfirmDialog({
            open: false,
            title: '',
            message: '',
            studentId: null
        });
    };

    return (
        <div className="container mt-4 mt-md-5">
            <div className="row justify-content-center">
                <div className="col-12">
                    {/* Page Header */}
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <button
                            className="btn btn-primary btn-lg d-flex align-items-center"
                            onClick={() => navigate("/adddata")}
                        >
                            <AddIcon className="me-2" />
                            Add New Student
                        </button>
                    </div>

                    {/* Stats Card */}
                    <div className="row mb-4">
                        <div className="col-12 col-md-4">
                            <div className="card bg-gradient-primary text-white">
                                <div className="card-body text-center">
                                    <h3 className="mb-0 fw-bold">{students.length}</h3>
                                    <p className="mb-0">Total Students</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="card bg-gradient-success text-white">
                                <div className="card-body text-center">
                                    <h3 className="mb-0 fw-bold">{students.filter(s => s.rfid).length}</h3>
                                    <p className="mb-0">With RFID Tags</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="card bg-gradient-warning text-dark">
                                <div className="card-body text-center">
                                    <h3 className="mb-0 fw-bold">{students.filter(s => !s.rfid).length}</h3>
                                    <p className="mb-0">Pending RFID</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="card shadow-sm">
                        <div className="card-header bg-white">
                            <h5 className="mb-0 fw-semibold">Student List</h5>
                        </div>
                        <div className="card-body p-0">
                            {loading ? (
                                <div className="p-4">
                                    <div className="row">
                                        <div className="col-12">
                                            <Skeleton variant="rectangular" height={60} className="mb-3" />
                                            {[1, 2, 3, 4, 5].map((item) => (
                                                <Skeleton key={item} variant="rectangular" height={50} className="mb-2" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="p-4">
                                    <div className="alert alert-danger" role="alert">
                                        <h5 className="alert-heading">Error Loading Students</h5>
                                        <p>{error}</p>
                                        <hr />
                                        <button 
                                            className="btn btn-outline-danger"
                                            onClick={() => window.location.reload()}
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                </div>
                            ) : students.length === 0 ? (
                                <div className="p-4 text-center">
                                    <PeopleIcon style={{ fontSize: '4rem', color: '#6c757d' }} className="mb-3" />
                                    <h5 className="text-muted">No Students Found</h5>
                                    <p className="text-muted">Start by adding your first student.</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => navigate("/adddata")}
                                    >
                                        <AddIcon className="me-2" />
                                        Add First Student
                                    </button>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead>
                                            <tr className="bg-light">
                                                <th scope="col" className="border-0">#</th>
                                                <th scope="col" className="border-0">Last Name</th>
                                                <th scope="col" className="border-0">First Name</th>
                                                <th scope="col" className="border-0">Middle Name</th>
                                                <th scope="col" className="border-0">Grade & Section</th>
                                                <th scope="col" className="border-0">RFID Tag</th>
                                                <th scope="col" className="border-0 text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((student, idx) => (
                                                <tr key={student._id} className="align-middle">
                                                    <td className="fw-semibold">{idx + 1}</td>
                                                    <td className="fw-semibold">{student.lastName}</td>
                                                    <td>{student.firstName}</td>
                                                    <td>{student.middleName || '-'}</td>
                                                    <td>
                                                        <span className="badge bg-primary">{student.grlvl}</span>
                                                    </td>
                                                    <td>
                                                        {student.rfid ? (
                                                            <span className="badge bg-success">{student.rfid}</span>
                                                        ) : (
                                                            <span className="badge bg-warning text-dark">Pending</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div className="d-flex justify-content-center gap-2">
                                                            <NavLink to={`/view/${student._id}`}>
                                                                <button 
                                                                    className="btn btn-outline-primary btn-sm"
                                                                    title="View Details"
                                                                >
                                                                    <VisibilityIcon />
                                                                </button>
                                                            </NavLink>
                                                            <NavLink to={`/edit/${student._id}`}>
                                                                <button 
                                                                    className="btn btn-outline-warning btn-sm"
                                                                    title="Edit Student"
                                                                >
                                                                    <EditIcon />
                                                                </button>
                                                            </NavLink>
                                                            <button 
                                                                className="btn btn-outline-danger btn-sm"
                                                                onClick={() => handleArchive(student._id)}
                                                                title="Archive Student"
                                                            >
                                                                <ArchiveIcon />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialog.open}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{confirmDialog.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {confirmDialog.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleConfirmArchive} 
                        color="warning"
                        variant="contained"
                        autoFocus
                    >
                        Archive Student
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Home