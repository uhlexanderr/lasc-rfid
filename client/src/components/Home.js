import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';

const Home = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    return (
        <div className='mt-5'>
            <div className='container'>
                <div className='add_btn mt-2'>
                    <NavLink to="/AddData">
                        <button className='btn btn-primary'>Add Data</button>
                    </NavLink>
                </div>

                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div className="alert alert-danger">{error}</div>
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
                                    <td className='d-flex justify-content-between'>
                                        <NavLink to={`/view/${student._id}`}>
                                            <button className='btn btn-success'><VisibilityIcon /></button>
                                        </NavLink>
                                        <button className='btn btn-warning'><EditIcon /></button>
                                        <button className='btn btn-danger'><ArchiveIcon /></button>
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

export default Home