import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import Skeleton from '@mui/material/Skeleton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';

const Home = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        title: '',
        message: '',
        studentId: null
    });
    
    // Filter states
    const [filters, setFilters] = useState({
        search: '',
        gradeLevel: '',
        rfidStatus: '',
        schoolYear: ''
    });
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await axios.get("http://localhost:8003/api/students");
                setStudents(res.data.students);
                setFilteredStudents(res.data.students);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch students");
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    // Filter students based on search criteria
    useEffect(() => {
        let filtered = [...students];
        
        // Search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(student => 
                student.firstName.toLowerCase().includes(searchTerm) ||
                student.lastName.toLowerCase().includes(searchTerm) ||
                student.middleName?.toLowerCase().includes(searchTerm) ||
                student.grlvl.toLowerCase().includes(searchTerm) ||
                student.rfid?.toLowerCase().includes(searchTerm) ||
                student.sy?.toLowerCase().includes(searchTerm)
            );
        }
        
        // Grade level filter
        if (filters.gradeLevel) {
            filtered = filtered.filter(student => student.grlvl === filters.gradeLevel);
        }
        
        // RFID status filter
        if (filters.rfidStatus) {
            if (filters.rfidStatus === 'with') {
                filtered = filtered.filter(student => student.rfid);
            } else if (filters.rfidStatus === 'without') {
                filtered = filtered.filter(student => !student.rfid);
            }
        }
        
        // School year filter
        if (filters.schoolYear) {
            filtered = filtered.filter(student => student.sy === filters.schoolYear);
        }
        
        setFilteredStudents(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [students, filters]);

    // Get current students for pagination
    const indexOfLastStudent = currentPage * itemsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            gradeLevel: '',
            rfidStatus: '',
            schoolYear: ''
        });
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleItemsPerPageChange = (event) => {
        const newItemsPerPage = parseInt(event.target.value);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page when items per page changes
    };

    // Get unique grade levels for filter dropdown
    const uniqueGradeLevels = [
        'Nursery 1 - Hope',
        'Nursery 2 - Grace',
        'Kinder - Peace',
        'Kinder - Love',
        'Grade 1 - Creativity',
        'Grade 2 - Synergy',
        'Grade 3 - Innovation',
        'Grade 4 - Gratitude',
        'Grade 5 - Wisdom',
        'Grade 6 - Obedience',
        'Grade 7 - Purity',
        'Grade 8 - Charity',
        'Grade 9 - Humility',
        'Grade 10 - Serenity',
        'Grade 11 - Diligence',
        'Grade 12 - Integrity'
    ];

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
                            <div className="row align-items-center">
                                <div className="col-md-6">
                                    <h5 className="mb-0 fw-semibold">Student List</h5>
                                    <small className="text-muted">
                                        Showing {filteredStudents.length} of {students.length} students
                                    </small>
                                </div>
                                <div className="col-md-6 text-end">
                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={clearFilters}
                                        disabled={!filters.search && !filters.gradeLevel && !filters.rfidStatus && !filters.schoolYear}
                                    >
                                        <ClearIcon className="me-1" />
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Filters Section */}
                        <div className="card-body border-bottom">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Search Students"
                                        variant="outlined"
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        InputProps={{
                                            startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                                        }}
                                        placeholder="Search by name, grade, RFID, or school year..."
                                    />
                                </div>
                                <div className="col-md-2">
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Grade Level</InputLabel>
                                        <Select
                                            value={filters.gradeLevel}
                                            label="Grade Level"
                                            onChange={(e) => handleFilterChange('gradeLevel', e.target.value)}
                                        >
                                            <MenuItem value="">All Grades</MenuItem>
                                            {uniqueGradeLevels.map(grade => (
                                                <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="col-md-2">
                                    <FormControl fullWidth size="small">
                                        <InputLabel>RFID Status</InputLabel>
                                        <Select
                                            value={filters.rfidStatus}
                                            label="RFID Status"
                                            onChange={(e) => handleFilterChange('rfidStatus', e.target.value)}
                                        >
                                            <MenuItem value="">All Students</MenuItem>
                                            <MenuItem value="with">With RFID</MenuItem>
                                            <MenuItem value="without">Without RFID</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="col-md-2">
                                    <FormControl fullWidth size="small">
                                        <InputLabel>School Year</InputLabel>
                                        <Select
                                            value={filters.schoolYear}
                                            label="School Year"
                                            onChange={(e) => handleFilterChange('schoolYear', e.target.value)}
                                        >
                                            <MenuItem value="">All Years</MenuItem>
                                            <MenuItem value="2023-2024">2023-2024</MenuItem>
                                            <MenuItem value="2024-2025">2024-2025</MenuItem>
                                            <MenuItem value="2025-2026">2025-2026</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
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
                            ) : filteredStudents.length === 0 ? (
                                <div className="p-4 text-center">
                                    <PeopleIcon style={{ fontSize: '4rem', color: '#6c757d' }} className="mb-3" />
                                    <h5 className="text-muted">
                                        {students.length === 0 ? 'No Students Found' : 'No Students Match Your Filters'}
                                    </h5>
                                    <p className="text-muted">
                                        {students.length === 0 
                                            ? 'Start by adding your first student.' 
                                            : 'Try adjusting your search criteria or clear the filters.'
                                        }
                                    </p>
                                    {students.length === 0 && (
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => navigate("/adddata")}
                                        >
                                            <AddIcon className="me-2" />
                                            Add First Student
                                        </button>
                                    )}
                                    {students.length > 0 && (
                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={clearFilters}
                                        >
                                            <ClearIcon className="me-2" />
                                            Clear Filters
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <>
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
                                                {currentStudents.map((student, idx) => (
                                                    <tr key={student._id} className="align-middle">
                                                        <td className="fw-semibold">{indexOfFirstStudent + idx + 1}</td>
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
                                    
                                    {/* Pagination */}
                                    <div className="card-footer bg-white border-top">
                                        <div className="row align-items-center">
                                            <div className="col-md-4">
                                                <div className="d-flex align-items-center">
                                                    <span className="text-muted me-2">Show:</span>
                                                    <FormControl size="small" sx={{ minWidth: 80 }}>
                                                        <Select
                                                            value={itemsPerPage}
                                                            onChange={handleItemsPerPageChange}
                                                            displayEmpty
                                                        >
                                                            <MenuItem value={5}>5</MenuItem>
                                                            <MenuItem value={10}>10</MenuItem>
                                                            <MenuItem value={25}>25</MenuItem>
                                                            <MenuItem value={50}>50</MenuItem>
                                                            <MenuItem value={100}>100</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                    <span className="text-muted ms-2">entries per page</span>
                                                </div>
                                            </div>
                                            <div className="col-md-4 text-end">
                                                {totalPages > 1 && (
                                                    <Box display="flex" justifyContent="center">
                                                        <Pagination
                                                            count={totalPages}
                                                            page={currentPage}
                                                            onChange={handlePageChange}
                                                            color="primary"
                                                            size="large"
                                                        />
                                                    </Box>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
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
                <DialogTitle id="alert-dialog-title">
                    {confirmDialog.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {confirmDialog.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleConfirmArchive} color="error" autoFocus>
                        Archive
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Home