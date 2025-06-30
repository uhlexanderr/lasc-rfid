import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { storage } from '../firebase'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AddData = () => {

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
})

const [file, setFile] = useState(null);
const [message, setMessage] = useState("");
const [loading, setLoading] = useState(false);
const [uploadProgress, setUploadProgress] = useState("");
const [students, setStudents] = useState([]);

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

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setUploadProgress("");

    // Validation
    if (!inpval.lastName || !inpval.firstName || !inpval.grlvl) {
        setMessage("Please fill in all required fields (Last Name, First Name, Grade Level).");
        setLoading(false);
        return;
    }
    // LRN: 12 digits, numbers only
    if (inpval.lrn && (!/^\d{12}$/.test(inpval.lrn))) {
        setMessage("LRN must be exactly 12 digits.");
        setLoading(false);
        return;
    }
    // Mobile: 11 digits, numbers only
    if (inpval.mobileNo && (!/^\d{11}$/.test(inpval.mobileNo))) {
        setMessage("Mobile number must be exactly 11 digits.");
        setLoading(false);
        return;
    }
    // RFID: numbers only (allow empty, but if filled must be numbers)
    if (inpval.rfid && (!/^\d+$/.test(inpval.rfid))) {
        setMessage("RFID must be numbers only.");
        setLoading(false);
        return;
    }
    // LRN: unique
    if (inpval.lrn && students.some(s => s.lrn === inpval.lrn)) {
        setMessage("LRN already exists. Please enter a unique LRN.");
        setLoading(false);
        return;
    }
    // RFID: unique
    if (inpval.rfid && students.some(s => s.rfid === inpval.rfid)) {
        setMessage("RFID already exists. Please enter a unique RFID.");
        setLoading(false);
        return;
    }
    // Image size: max 5MB
    if (file && file.size > 5 * 1024 * 1024) {
        setMessage("Image size must be less than or equal to 5MB.");
        setLoading(false);
        return;
    }

    let picUrl = "";
    if (file) {
        try {
            setUploadProgress("Uploading image...");
            const storageRef = ref(storage, `students/${Date.now()}-${file.name}`);
            await uploadBytes(storageRef, file);
            picUrl = await getDownloadURL(storageRef);
            setUploadProgress("Image uploaded successfully!");
        } catch (uploadError) {
            setMessage("Error uploading image. Please try again.");
            setLoading(false);
            return;
        }
    }

    try {
        setUploadProgress("Adding student to database...");
        const dataToSend = { ...inpval, pic: picUrl };
        await axios.post("http://localhost:8003/api/students", dataToSend);
        setMessage("Student added successfully!");
        setINP({
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
        setFile(null);
        setUploadProgress("");
    } catch (error) {
        setMessage("Error adding student. Please check your input and try again.");
        setUploadProgress("");
    } finally {
        setLoading(false);
    }
}

return (
    <div className='container mt-4'>
        {/* Loading Overlay */}
        {loading && (
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
                 style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
                <div className="bg-white p-4 rounded shadow text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <h6 className="mb-2">Processing...</h6>
                    {uploadProgress && (
                        <p className="text-muted mb-0 small">{uploadProgress}</p>
                    )}
                </div>
            </div>
        )}

        {/* Page Header */}
        <div className="d-flex align-items-center mb-4">
            <div className="me-3">
                <h2 className="mb-0 fw-bold">Add New Student</h2>
            </div>
        </div>

        {/* Alert Messages */}
        {message && (
            <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`} role="alert">
                {message}
                <button type="button" className="btn-close" onClick={() => setMessage("")}></button>
            </div>
        )}

        {/* Form */}
        <div className="card shadow-sm">
            <div className="card-body p-4">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-4">
                        <label htmlFor="inputLastName" className="form-label fw-semibold">
                            Last Name <span className="text-danger">*</span>
                        </label>
                        <input 
                            type="text" 
                            value={inpval.lastName} 
                            onChange={setData} 
                            name="lastName" 
                            className="form-control" 
                            id="inputLastName"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="inputFirstName" className="form-label fw-semibold">
                            First Name <span className="text-danger">*</span>
                        </label>
                        <input 
                            type="text" 
                            value={inpval.firstName} 
                            onChange={setData} 
                            name="firstName" 
                            className="form-control" 
                            id="inputFirstName"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="col-md-2">
                        <label htmlFor="inputMiddleName" className="form-label fw-semibold">Middle Name</label>
                        <input 
                            type="text" 
                            value={inpval.middleName} 
                            onChange={setData} 
                            name="middleName" 
                            className="form-control" 
                            id="inputMiddleName"
                            disabled={loading}
                        />
                    </div>
                    <div className="col-md-2">
                        <label htmlFor="inputGradelvl" className="form-label fw-semibold">
                            Grade Level <span className="text-danger">*</span>
                        </label>
                        <select 
                            id="inputGradelvl" 
                            value={inpval.grlvl} 
                            onChange={setData} 
                            name="grlvl" 
                            className="form-select"
                            required
                            disabled={loading}
                        >
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
                        <label htmlFor="inputAddress" className="form-label fw-semibold">Address</label>
                        <input 
                            type="text" 
                            value={inpval.address} 
                            onChange={setData} 
                            name="address" 
                            className="form-control" 
                            id="inputAddress"
                            disabled={loading}
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="inputRFID" className="form-label fw-semibold">RFID Number</label>
                        <input 
                            type="text" 
                            value={inpval.rfid} 
                            onChange={setData} 
                            name="rfid" 
                            className="form-control" 
                            id="inputRFID"
                            disabled={loading}
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="inputLRN" className="form-label fw-semibold">LRN</label>
                        <input 
                            type="text" 
                            value={inpval.lrn} 
                            onChange={setData} 
                            name="lrn" 
                            className="form-control" 
                            id="inputLRN"
                            disabled={loading}
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="formFile" className="form-label fw-semibold">Student Picture</label>
                        <input 
                            className="form-control" 
                            type="file" 
                            name="pic" 
                            id="formFile" 
                            onChange={setData}
                            accept="image/*"
                            disabled={loading}
                        />
                        <div className="form-text">Upload a clear photo of the student (JPG, PNG, GIF)</div>
                    </div>
                    <div className="col-md-2">
                        <label htmlFor="inputSy" className="form-label fw-semibold">School Year</label>
                        <select 
                            id="inputSy" 
                            value={inpval.sy} 
                            onChange={setData} 
                            name="sy" 
                            className="form-select"
                            disabled={loading}
                        >
                            <option value="">Choose...</option>
                            <option value="2023-2024">2023-2024</option>
                            <option value="2024-2025">2024-2025</option>
                            <option value="2025-2026">2025-2026</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="inputParentName" className="form-label fw-semibold">Parent/Guardian Name</label>
                        <input 
                            type="text" 
                            value={inpval.parentName} 
                            onChange={setData} 
                            name="parentName" 
                            className="form-control" 
                            id="inputParentName"
                            disabled={loading}
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="inputMobileNumber" className="form-label fw-semibold">Mobile Number</label>
                        <input 
                            type="text" 
                            value={inpval.mobileNo} 
                            onChange={setData} 
                            name="mobileNo" 
                            className="form-control" 
                            id="inputMobileNumber"
                            disabled={loading}
                        />
                    </div>
                    <div className="col-12 d-flex justify-content-end gap-2">
                        <button 
                            type="button" 
                            className="btn btn-outline-secondary"
                            onClick={() => window.history.back()}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Adding Student...
                                </>
                            ) : (
                                'Add Student'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
)
}

export default AddData