import React, { useState } from 'react'

const EditData = () => {

    const [inpval, setINP] = useState({
        name: "",
        grlvl: "",
        address: "",
        rfid: "",
        lrn: "",
        pic: "",
        sy: "",
        parentName: "",
        mobileNo: "",
        hideStudent: "",
    })

    const setData = (e) => {
        console.log(e.target.value);
        const { name, value } = e.target;
        setINP((preval) => {
            return {
                ...preval,
                [name]: value
            }
        })
    }

    return (
        <div className='container'>
            Edit Data
            <form className="row g-3">
                <div className="col-md-8">
                    <label htmlFor="inputFullName" className="form-label">Full Name</label>
                    <input type="name" value={inpval.name} onChange={setData} name="name" className="form-control" id="inputFullName" />
                </div>
                <div className="col-md-4">
                    <label htmlFor="inputGradelvl" className="form-label">Grade Level and Section</label>
                    <select id="inputGradelvl" value={inpval.grlvl} onChange={setData} name="grlvl" className="form-select">
                        <option defaultValue>Choose...</option>
                        <option>...</option>
                    </select>
                </div>
                <div className="col-md-12">
                    <label htmlFor="inputAddress" className="form-label">Address</label>
                    <input type="name" value={inpval.address} onChange={setData} name="address" className="form-control" id="inputAddress" />
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
                    <input className="form-control" type="file" value={inpval.pic} onChange={setData} name="pic" id="formFile" />
                </div>
                <div className="col-md-2">
                    <label htmlFor="inputSy" className="form-label">Shool Year</label>
                    <select id="inputSy" value={inpval.sy} onChange={setData} name="sy" className="form-select">
                        <option defaultValue>Choose...</option>
                        <option>...</option>
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
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="gridCheck" />
                        <label className="form-check-label" value={inpval.hideStudent} onChange={setData} name="hideStudent" htmlFor="gridCheck">
                            Hide Student Entry
                        </label>
                    </div>
                </div>
                <div className="col-12">
                    <button type="submit" className="btn btn-primary">Add Student</button>
                </div>
            </form>
        </div>
    )
}

export default EditData