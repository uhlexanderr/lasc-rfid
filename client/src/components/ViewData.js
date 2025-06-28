import React, { useEffect, useState } from 'react';
import CreateIcon from '@mui/icons-material/Create';
import ArchiveIcon from '@mui/icons-material/Archive';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import WorkIcon from '@mui/icons-material/Work';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Skeleton from '@mui/material/Skeleton';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewData = () => {
    const [student, setStudent] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getStudent = async () => {
            try {
                const res = await axios.get(`http://localhost:8003/api/students/${id}`);
                setStudent(res.data.student);
            } catch (error) {
                console.log("Fetch error:", error);
            }
        };
        getStudent();
    }, [id]);

    const handleArchive = async (id) => {
        if (window.confirm("Are you sure you want to archive this student?")) {
            try {
                await axios.put(`http://localhost:8003/api/students/${id}/archive`);
                navigate("/");
            } catch (error) {
                console.log("Archive error:", error);
            }
        }
    };

    if (!student) {
        return (
            <div className="container mt-3">
                <h1 style={{ fontWeight: 400 }}>Student Details</h1>
                <Card sx={{ maxWidth: 600 }}>
                    <CardContent>
                        <div className="add_btn d-flex mb-3">
                            <Skeleton variant="rectangular" width={100} height={40} sx={{ mr: 2 }} />
                            <Skeleton variant="rectangular" width={100} height={40} />
                        </div>
                        <div className="row">
                            <div className="left_view col-lg-6 col-md-6 col-12">
                                <Skeleton variant="rounded" width={150} height={150} sx={{ mb: 2 }} />
                                <Skeleton variant="text" width="100%" height={30} />
                                <Skeleton variant="text" width="80%" height={30} />
                                <Skeleton variant="text" width="90%" height={25} />
                                <Skeleton variant="text" width="70%" height={25} />
                                <Skeleton variant="text" width="60%" height={25} />
                            </div>
                            <div className="right_view col-lg-6 col-md-6 col-12">
                                <Skeleton variant="text" width="90%" height={30} sx={{ mt: 4 }} />
                                <Skeleton variant="text" width="85%" height={30} />
                                <Skeleton variant="text" width="80%" height={30} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mt-3">
            <h1 style={{ fontWeight: 400 }}>Student Details</h1>

            <Card sx={{ maxWidth: 600 }}>
                <CardContent>
                    <div className="add_btn">
                        <NavLink to={`/edit/${student._id}`}>
                            <button className="btn btn-warning mx-2"><CreateIcon /></button>
                        </NavLink>
                        <button className="btn btn-danger" onClick={() => handleArchive(student._id)}>
                            <ArchiveIcon />
                        </button>
                    </div>
                    <div className="row">
                        <div className="left_view col-lg-6 col-md-6 col-12">
                            <img
                                src={student.pic || "/avatar.png"}
                                style={{
                                    width: 150,
                                    height: 150,
                                    objectFit: 'cover',
                                    borderRadius: '10px',
                                    border: '3px solid #ddd'
                                }}
                                alt="Student Profile"
                                onError={(e) => {
                                    e.target.src = "/avatar.png";
                                }}
                            />
                            <h3 className="mt-3">Name: <span>{student.firstName} {student.middleName} {student.lastName}</span></h3>
                            <h3 className="mt-3">Grade & Section: <span>{student.grlvl}</span></h3>
                            <p className="mt-3"><MailOutlineIcon /> LRN: <span>{student.lrn}</span></p>
                            <p className="mt-3"><WorkIcon /> School Year: <span>{student.sy}</span></p>
                            <p className="mt-3"><strong>RFID:</strong> <span>{student.rfid}</span></p>
                        </div>
                        <div className="right_view col-lg-6 col-md-6 col-12">
                            <p className="mt-5"><PhoneAndroidIcon /> Mobile: <span>{student.mobileNo}</span></p>
                            <p className="mt-3"><LocationOnIcon /> Address: <span>{student.address}</span></p>
                            <p className="mt-3">Parent/Guardian: <span>{student.parentName}</span></p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ViewData;