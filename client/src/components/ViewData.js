import React, { useEffect, useState } from 'react';
import CreateIcon from '@mui/icons-material/Create';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import WorkIcon from '@mui/icons-material/Work';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewData = () => {
    const [student, setStudent] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const getStudent = async () => {
        try {
            const res = await axios.get(`http://localhost:8003/api/students/${id}`);
            setStudent(res.data.student);
        } catch (error) {
            console.log("Fetch error:", error);
        }
    };

    useEffect(() => {
        getStudent();
    }, [id]);

    const deleteStudent = async (id) => {
        try {
            await axios.delete(`http://localhost:8003/api/students/${id}`);
            navigate("/");
        } catch (error) {
            console.log("Delete error:", error);
        }
    };

    if (!student) return <div>Loading...</div>;

    return (
        <div className="container mt-3">
            <h1 style={{ fontWeight: 400 }}>Student Details</h1>

            <Card sx={{ maxWidth: 600 }}>
                <CardContent>
                    <div className="add_btn">
                        <NavLink to={`/edit/${student._id}`}>
                            <button className="btn btn-primary mx-2"><CreateIcon /></button>
                        </NavLink>
                        <button className="btn btn-danger" onClick={() => deleteStudent(student._id)}>
                            <DeleteOutlineIcon />
                        </button>
                    </div>
                    <div className="row">
                        <div className="left_view col-lg-6 col-md-6 col-12">
                            <img src={student.pic || "/profile.png"} style={{ width: 100, height: 100, objectFit: 'cover' }} alt="profile" />
                            <h3 className="mt-3">Name: <span>{student.firstName} {student.middleName} {student.lastName}</span></h3>
                            <h3 className="mt-3">Grade & Section: <span>{student.grlvl}</span></h3>
                            <p className="mt-3"><MailOutlineIcon /> LRN: <span>{student.lrn}</span></p>
                            <p className="mt-3"><WorkIcon /> School Year: <span>{student.sy}</span></p>
                        </div>
                        <div className="right_view col-lg-6 col-md-6 col-12">
                            <p className="mt-5"><PhoneAndroidIcon /> Mobile: <span>{student.mobileNo}</span></p>
                            <p className="mt-3"><LocationOnIcon /> Address: <span>{student.address}</span></p>
                            <p className="mt-3">Parent/Guardian: <span>{student.parentName}</span></p>
                            <p className="mt-3">RFID: <span>{student.rfid}</span></p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ViewData;
