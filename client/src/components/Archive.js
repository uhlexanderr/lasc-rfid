import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArchiveIcon from '@mui/icons-material/Archive';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import PeopleIcon from '@mui/icons-material/People';

const Archive = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        title: '',
        message: '',
        action: null,
        studentId: null
    });

    useEffect(() => {
        const fetchArchivedStudents = async () => {
            try {
                const res = await axios.get("http://localhost:8003/api/students/archived");
                setStudents(res.data.students);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch archived students");
                setLoading(false);
            }
        };
        fetchArchivedStudents();
    }, []);

    const handleRestore = (studentId) => {
        setConfirmDialog({
            open: true,
            title: 'Restore Student',
            message: 'Are you sure you want to restore this student? They will be moved back to the active students list.',
            action: 'restore',
            studentId: studentId
        });
    };

    const handleDelete = (studentId) => {
        setConfirmDialog({
            open: true,
            title: 'Permanently Delete Student',
            message: 'Are you sure you want to permanently delete this student? This action cannot be undone and all student data will be lost forever.',
            action: 'delete',
            studentId: studentId
        });
    };

    const handleConfirmAction = async () => {
        const { action, studentId } = confirmDialog;
        
        try {
            if (action === 'restore') {
                await axios.put(`http://localhost:8003/api/students/${studentId}/restore`);
            } else if (action === 'delete') {
                await axios.delete(`http://localhost:8003/api/students/${studentId}`);
            }
            
            // Refresh the archived students list
            const res = await axios.get("http://localhost:8003/api/students/archived");
            setStudents(res.data.students);
        } catch (error) {
            console.log(`Error ${action}ing student:`, error);
        }
        
        // Close the dialog
        setConfirmDialog({
            open: false,
            title: '',
            message: '',
            action: null,
            studentId: null
        });
    };

    const handleCloseDialog = () => {
        setConfirmDialog({
            open: false,
            title: '',
            message: '',
            action: null,
            studentId: null
        });
    };

    return (
        <div className="container mt-4 mt-md-5">
            <div className="row justify-content-center">
                <div className="col-12">
                    {/* Page Header */}
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <div className="d-flex align-items-center">
                            <div>
                                <h2 className="mb-0 fw-bold">Archived Students</h2>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="card shadow-sm">
                        <div className="card-header bg-white">
                            <h5 className="mb-0 fw-semibold">Archived Student List</h5>
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
                                        <h5 className="alert-heading">Error Loading Archived Students</h5>
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
                                    <ArchiveIcon style={{ fontSize: '4rem', color: '#6c757d' }} className="mb-3" />
                                    <h5 className="text-muted">No Archived Students</h5>
                                    <p className="text-muted">There are currently no archived students in the system.</p>
                                    <NavLink to="/">
                                        <button className="btn btn-primary">
                                            Back to Active Students
                                        </button>
                                    </NavLink>
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
                                                <th scope="col" className="border-0">Archived Date</th>
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
                                                        <span className="text-muted">
                                                            {student.archivedAt ? new Date(student.archivedAt).toLocaleDateString() : 'N/A'}
                                                        </span>
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
                                                            <button 
                                                                className="btn btn-outline-warning btn-sm"
                                                                onClick={() => handleRestore(student._id)}
                                                                title="Restore Student"
                                                            >
                                                                <RestoreIcon />
                                                            </button>
                                                            <button 
                                                                className="btn btn-outline-danger btn-sm"
                                                                onClick={() => handleDelete(student._id)}
                                                                title="Delete Permanently"
                                                            >
                                                                <DeleteForeverIcon />
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

            {/* Material-UI Confirmation Dialog */}
            <Dialog
                open={confirmDialog.open}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {confirmDialog.title}
                </DialogTitle>
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
                        onClick={handleConfirmAction} 
                        color={confirmDialog.action === 'delete' ? 'error' : 'warning'}
                        variant="contained"
                        autoFocus
                    >
                        {confirmDialog.action === 'restore' ? 'Restore' : 'Delete Permanently'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Archive
