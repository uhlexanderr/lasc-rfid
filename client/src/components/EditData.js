import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { storage } from '../firebase'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const EditData = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [inpval, setINP] = useState({
        lastName: "",
        firstName: "",
        middleName: "",
        grlvl: "",
        address: "",
        rfid: "",
        lrn: "",
        pic: "",
        sy: "",
        parentName: "",
        mobileNo: "",
    });

    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const getStudent = async () => {
            try {
                const res = await axios.get(`http://localhost:8003/api/students/${id}`);
                setINP(res.data.student);
                setLoading(false);
            } catch (error) {
                console.log("Fetch error:", error);
                setLoading(false);
            }
        };
        getStudent();
    }, [id]);

    useEffect(() => {
        // Fetch all students for uniqueness check
        const fetchStudents = async () => {
            try {
                const res = await axios.get("http://localhost:8003/api/students");
                setStudents(res.data.students || []);
            } catch (err) {
                // Optionally handle error
            }
        };
        fetchStudents();
    }, []);

    const setData = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            setFile(files[0]);
        } else {
            setINP((preval) => ({
                ...preval,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validation
        if (!inpval.lastName || !inpval.firstName || !inpval.grlvl) {
            setMessage("Please fill in all required fields (Last Name, First Name, Grade Level).");
            return;
        }
        // LRN: 12 digits, numbers only
        if (inpval.lrn && (!/^\d{12}$/.test(inpval.lrn))) {
            setMessage("LRN must be exactly 12 digits.");
            return;
        }
        // Mobile: 11 digits, numbers only
        if (inpval.mobileNo && (!/^\d{11}$/.test(inpval.mobileNo))) {
            setMessage("Mobile number must be exactly 11 digits.");
            return;
        }
        // RFID: numbers only (allow empty, but if filled must be numbers)
        if (inpval.rfid && (!/^\d+$/.test(inpval.rfid))) {
            setMessage("RFID must be numbers only.");
            return;
        }
        // LRN: unique (exclude current student)
        if (inpval.lrn && students.some(s => s.lrn === inpval.lrn && s._id !== id)) {
            setMessage("LRN already exists. Please enter a unique LRN.");
            return;
        }
        // RFID: unique (exclude current student)
        if (inpval.rfid && students.some(s => s.rfid === inpval.rfid && s._id !== id)) {
            setMessage("RFID already exists. Please enter a unique RFID.");
            return;
        }
        // Image size: max 5MB
        if (file && file.size > 5 * 1024 * 1024) {
            setMessage("Image size must be less than or equal to 5MB.");
            return;
        }
        let picUrl = inpval.pic;

        if (file) {
            try {
                const storageRef = ref(storage, `students/${Date.now()}-${file.name}`);
                await uploadBytes(storageRef, file);
                picUrl = await getDownloadURL(storageRef);
            } catch (uploadError) {
                setMessage("Error uploading image.");
                return;
            }
        }

        try {
            const dataToSend = { ...inpval, pic: picUrl };
            await axios.put(`http://localhost:8003/api/students/${id}`, dataToSend);
            setMessage("Student updated successfully!");
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (error) {
            setMessage("Error updating student.");
        }
    }

    if (loading) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div className="container mt-4">
            <div className="d-flex align-items-center mb-4">
                <div>
                    <h2 className="mb-0 fw-bold">Edit Student</h2>
                </div>
            </div>

            {message && <div className="alert alert-info">{message}</div>}

            {/* 🟢 Card wrapper for the form */}
            <div className="card shadow-sm">
                <div className="card-body p-4">
                    <form className="row g-3" onSubmit={handleSubmit}>
                        <div className="col-md-4">
                            <label htmlFor="inputLastName" className="form-label">Last Name</label>
                            <input type="text" value={inpval.lastName} onChange={setData} name="lastName" className="form-control" id="inputLastName" />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="inputFirstName" className="form-label">First Name</label>
                            <input type="text" value={inpval.firstName} onChange={setData} name="firstName" className="form-control" id="inputFirstName" />
                        </div>
                        <div className="col-md-2">
                            <label htmlFor="inputMiddleName" className="form-label">Middle Name</label>
                            <input type="text" value={inpval.middleName} onChange={setData} name="middleName" className="form-control" id="inputMiddleName" />
                        </div>
                        <div className="col-md-2">
                            <label htmlFor="inputGradelvl" className="form-label">Grade Level and Section</label>
                            <select id="inputGradelvl" value={inpval.grlvl} onChange={setData} name="grlvl" className="form-select">
                                <option value="">Choose...</option>
                                <option value="Grade 7 - A">Grade 7 - A</option>
                                <option value="Grade 7 - B">Grade 7 - B</option>
                                <option value="Grade 8 - A">Grade 8 - A</option>
                                <option value="Grade 8 - B">Grade 8 - B</option>
                                <option value="Grade 9 - A">Grade 9 - A</option>
                                <option value="Grade 9 - B">Grade 9 - B</option>
                                <option value="Grade 10 - A">Grade 10 - A</option>
                                <option value="Grade 10 - B">Grade 10 - B</option>
                            </select>
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="inputAddress" className="form-label">Address</label>
                            <input type="text" value={inpval.address} onChange={setData} name="address" className="form-control" id="inputAddress" />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="inputRFID" className="form-label">RFID Number</label>
                            <input type="text" value={inpval.rfid} onChange={setData} name="rfid" className="form-control" id="inputRFID" />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="inputLRN" className="form-label">LRN</label>
                            <input type="text" value={inpval.lrn} onChange={setData} name="lrn" className="form-control" id="inputLRN" />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="formFile" className="form-label">Student Picture</label>
                            <input className="form-control" type="file" name="pic" id="formFile" onChange={setData} />
                            {inpval.pic && (
                                <small className="text-muted">Current image will be kept if no new file is selected</small>
                            )}
                        </div>
                        <div className="col-md-2">
                            <label htmlFor="inputSy" className="form-label">School Year</label>
                            <select id="inputSy" value={inpval.sy} onChange={setData} name="sy" className="form-select">
                                <option value="">Choose...</option>
                                <option value="2023-2024">2023-2024</option>
                                <option value="2024-2025">2024-2025</option>
                                <option value="2025-2026">2025-2026</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="inputParentName" className="form-label">Parent/Guardian Name</label>
                            <input type="text" value={inpval.parentName} onChange={setData} name="parentName" className="form-control" id="inputParentName" />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="inputMobileNumber" className="form-label">Mobile Number</label>
                            <input type="text" value={inpval.mobileNo} onChange={setData} name="mobileNo" className="form-control" id="inputMobileNumber" />
                        </div>
                        <div className="col-12 d-flex justify-content-end gap-2">
                            <button type="submit" className="btn btn-primary">Update Student</button>
                            <button type="button" className="btn btn-secondary" onClick={() => navigate("/")}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditData;
