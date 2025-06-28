import React, { useState } from 'react'
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
    let picUrl = "";
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
    } catch (error) {
        setMessage("Error adding student.");
    }
}

return (
    <div className='container'>
        {message && <div className="alert alert-info">{message}</div>}
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
                    {/* Add more options as needed */}
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
            </div>
            <div className="col-md-2">
                <label htmlFor="inputSy" className="form-label">School Year</label>
                <select id="inputSy" value={inpval.sy} onChange={setData} name="sy" className="form-select">
                    <option value="">Choose...</option>
                    <option value="2023-2024">2023-2024</option>
                    <option value="2024-2025">2024-2025</option>
                    {/* Add more options as needed */}
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
            <div className="col-12">
                <button type="submit" className="btn btn-primary">Add Student</button>
            </div>
        </form>
    </div>
)
}

export default AddData