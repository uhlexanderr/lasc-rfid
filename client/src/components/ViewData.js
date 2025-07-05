import React, { useEffect, useState } from 'react';
import CreateIcon from '@mui/icons-material/Create';
import ArchiveIcon from '@mui/icons-material/Archive';
import PersonIcon from '@mui/icons-material/Person';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import WorkIcon from '@mui/icons-material/Work';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import Skeleton from '@mui/material/Skeleton';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewData = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [imgLoading, setImgLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getStudent = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:8003/api/students/${id}`);
                setStudent(res.data.student);
            } catch (error) {
                console.log("Fetch error:", error);
                setError('Failed to load student details');
            } finally {
                setLoading(false);
            }
        };
        getStudent();
    }, [id]);

    useEffect(() => {
        setImgLoading(true);
    }, [student]);

    const handleArchive = async (id) => {
        if (window.confirm("Are you sure you want to archive this student?")) {
            try {
                await axios.put(`http://localhost:8003/api/students/${id}/archive`);
                navigate("/");
            } catch (error) {
                console.log("Archive error:", error);
                alert('Failed to archive student');
            }
        }
    };

    if (loading) {
        return (
            <div className="container mt-4 mt-md-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-10 col-xl-8">
                        {/* Page Header Skeleton */}
                        <div className="d-flex align-items-center mb-4">
                            <Skeleton variant="circular" width={40} height={40} className="me-3" />
                            <div>
                                <Skeleton variant="text" width={200} height={32} />
                                <Skeleton variant="text" width={150} height={20} />
                            </div>
                        </div>

                        <Card sx={{ maxWidth: '100%' }} className="shadow-sm">
                            <CardContent className="p-4">
                                {/* Action Buttons Skeleton */}
                                <div className="d-flex justify-content-end mb-4">
                                    <Skeleton variant="rectangular" width={120} height={48} sx={{ mr: 2 }} />
                                    <Skeleton variant="rectangular" width={120} height={48} />
                                </div>

                                <div className="row g-4">
                                    {/* Left Column Skeleton */}
                                    <div className="col-12 col-lg-6">
                                        <div className="text-center mb-4">
                                            <Skeleton variant="circular" width={180} height={180} className="mb-3" />
                                            <Skeleton variant="text" width="80%" height={32} className="mb-2" />
                                            <Skeleton variant="text" width="60%" height={24} />
                                        </div>

                                        <div className="space-y-3">
                                            {[1, 2, 3, 4, 5].map((item) => (
                                                <div key={item} className="d-flex align-items-center p-3 bg-light rounded">
                                                    <Skeleton variant="circular" width={24} height={24} className="me-3" />
                                                    <div className="flex-grow-1">
                                                        <Skeleton variant="text" width="40%" height={16} />
                                                        <Skeleton variant="text" width="80%" height={20} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right Column Skeleton */}
                                    <div className="col-12 col-lg-6">
                                        <div className="space-y-3">
                                            {[1, 2, 3, 4].map((item) => (
                                                <div key={item} className="d-flex align-items-center p-3 bg-light rounded">
                                                    <Skeleton variant="circular" width={24} height={24} className="me-3" />
                                                    <div className="flex-grow-1">
                                                        <Skeleton variant="text" width="35%" height={16} />
                                                        <Skeleton variant="text" width="90%" height={20} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4 mt-md-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-8">
                        <div className="alert alert-danger" role="alert">
                            <h4 className="alert-heading">Error Loading Student</h4>
                            <p>{error}</p>
                            <hr />
                            <button className="btn btn-outline-danger" onClick={() => navigate('/')}>
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="container mt-4 mt-md-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-8">
                        <div className="alert alert-warning" role="alert">
                            <h4 className="alert-heading">Student Not Found</h4>
                            <p>The student you're looking for doesn't exist or has been removed.</p>
                            <hr />
                            <button className="btn btn-outline-warning" onClick={() => navigate('/')}>
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4 mt-md-5">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-10 col-xl-8">
                    <Card sx={{ maxWidth: '100%' }} className="shadow-sm border-0">
                        <CardContent className="p-4">
                            {/* Action Buttons */}
                            <div className="d-flex justify-content-center mb-4">
                                <NavLink to={`/edit/${student._id}`}>
                                    <button className="btn btn-warning btn-lg me-2">
                                        <CreateIcon className="me-2" />
                                        Edit
                                    </button>
                                </NavLink>
                                <button
                                    className="btn btn-danger btn-lg"
                                    onClick={() => handleArchive(student._id)}
                                >
                                    <ArchiveIcon className="me-2" />
                                    Archive
                                </button>
                            </div>

                            <div className="row g-4">
                                {/* Left Column */}
                                <div className="col-12 col-lg-6">
                                    <div className="text-center mb-4">
                                        <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto' }}>
                                            {imgLoading && (
                                                <Skeleton variant="rectangular" width={180} height={180} sx={{ position: 'absolute', top: 0, left: 0, zIndex: 1, borderRadius: '8px' }} />
                                            )}
                                            <img
                                                src={student.pic || "/avatar.png"}
                                                style={{
                                                    width: '180px',
                                                    height: '180px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    border: '4px solid #e9ecef',
                                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                                    display: imgLoading ? 'none' : 'block',
                                                }}
                                                alt="Student Profile"
                                                onError={(e) => { e.target.src = "/avatar.png"; setImgLoading(false); }}
                                                onLoad={() => setImgLoading(false)}
                                            />
                                        </div>
                                        <h4 className="mt-3 mb-1 fw-bold">
                                            {student.firstName} {student.middleName} {student.lastName}
                                        </h4>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="d-flex align-items-center p-3 bg-light rounded">
                                            <SchoolIcon className="me-3 text-primary" style={{ fontSize: '1.2rem' }} />
                                            <div className="flex-grow-1">
                                                <small className="text-muted d-block">Grade & Section</small>
                                                <strong>{student.grlvl}</strong>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center p-3 bg-light rounded">
                                            <MailOutlineIcon className="me-3 text-primary" style={{ fontSize: '1.2rem' }} />
                                            <div className="flex-grow-1">
                                                <small className="text-muted d-block">LRN</small>
                                                <strong>{student.lrn}</strong>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center p-3 bg-light rounded">
                                            <WorkIcon className="me-3 text-primary" style={{ fontSize: '1.2rem' }} />
                                            <div className="flex-grow-1">
                                                <small className="text-muted d-block">School Year</small>
                                                <strong>{student.sy}</strong>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center p-3 bg-light rounded">
                                            <PersonIcon className="me-3 text-primary" style={{ fontSize: '1.2rem' }} />
                                            <div className="flex-grow-1">
                                                <small className="text-muted d-block">RFID Tag</small>
                                                <strong className="text-success">{student.rfid}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="col-12 col-lg-6">
                                    <h5 className="mb-4 fw-bold text-primary">
                                        <ContactPhoneIcon className="me-2" />
                                        Contact Information
                                    </h5>

                                    <div className="space-y-3">
                                        <div className="d-flex align-items-center p-3 bg-light rounded">
                                            <PhoneAndroidIcon className="me-3 text-primary" style={{ fontSize: '1.2rem' }} />
                                            <div className="flex-grow-1">
                                                <small className="text-muted d-block">Mobile Number</small>
                                                <strong>{student.mobileNo}</strong>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center p-3 bg-light rounded">
                                            <LocationOnIcon className="me-3 text-primary" style={{ fontSize: '1.2rem' }} />
                                            <div className="flex-grow-1">
                                                <small className="text-muted d-block">Address</small>
                                                <strong>{student.address}</strong>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center p-3 bg-light rounded">
                                            <PersonIcon className="me-3 text-primary" style={{ fontSize: '1.2rem' }} />
                                            <div className="flex-grow-1">
                                                <small className="text-muted d-block">Parent/Guardian</small>
                                                <strong>{student.parentName}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ViewData;