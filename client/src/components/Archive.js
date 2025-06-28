import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArchiveIcon from '@mui/icons-material/Archive';

const Archive = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    const handleRestore = async (studentId) => {
        if (window.confirm("Are you sure you want to restore this student?")) {
            try {
                await axios.put(`http://localhost:8003/api/students/${studentId}/restore`);
                // Refresh the archived students list
                const res = await axios.get("http://localhost:8003/api/students/archived");
                setStudents(res.data.students);
            } catch (error) {
                console.log("Error restoring student:", error);
            }
        }
    };

    const handleDelete = async (studentId) => {
        if (window.confirm("Are you sure you want to permanently delete this student? This action cannot be undone.")) {
            try {
                await axios.delete(`http://localhost:8003/api/students/${studentId}`);
                // Refresh the archived students list
                const res = await axios.get("http://localhost:8003/api/students/archived");
                setStudents(res.data.students);
            } catch (error) {
                console.log("Error deleting student:", error);
            }
        }
    };

    return (
        <div className='mt-5'>
            <div className='container'>
                <div className='d-flex justify-content-between align-items-center mb-4'>
                    <h2><ArchiveIcon className="me-2" />Archived Students</h2>
                    <NavLink to="/">
                        <button className='btn btn-primary'>Back to Home</button>
                    </NavLink>
                </div>

                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : students.length === 0 ? (
                    <div className="alert alert-info">No archived students found.</div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr className='table-dark'>
                                <th scope="col">#</th>
                                <th scope="col">Last Name</th>
                                <th scope="col">First Name</th>
                                <th scope="col">Middle Name</th>
                                <th scope="col">Grade and Section</th>
                                <th scope="col">RFID No.</th>
                                <th scope="col">Archived Date</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, idx) => (
                                <tr key={student._id}>
                                    <th scope="row">{idx + 1}</th>
                                    <td>{student.lastName}</td>
                                    <td>{student.firstName}</td>
                                    <td>{student.middleName}</td>
                                    <td>{student.grlvl}</td>
                                    <td>{student.rfid}</td>
                                    <td>{student.archivedAt ? new Date(student.archivedAt).toLocaleDateString() : 'N/A'}</td>
                                    <td className='d-flex justify-content-between'>
                                        <NavLink to={`/view/${student._id}`}>
                                            <button className='btn btn-success'><VisibilityIcon /></button>
                                        </NavLink>
                                        <button className='btn btn-warning' onClick={() => handleRestore(student._id)}>
                                            <RestoreIcon />
                                        </button>
                                        <button className='btn btn-danger' onClick={() => handleDelete(student._id)}>
                                            <DeleteForeverIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default Archive
