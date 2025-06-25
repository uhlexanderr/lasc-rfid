import React from 'react'
import { NavLink } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';

const Home = () => {
    return (
        <div className='mt-5'>
            <div className='container'>
                <div className='add_btn mt-2'>
                    <NavLink to="/AddData">
                        <button className='btn btn-primary'>Add Data</button>
                    </NavLink>
                </div>

                <table className="table">
                    <thead>
                        <tr className='table-dark'>
                            <th scope="col">id</th>
                            <th scope="col">Student Name</th>
                            <th scope="col">Grade and Section</th>
                            <th scope="col">LRN</th>
                            <th scope="col">RFID No.</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                            <td>@mdo</td>
                            <td className='d-flex justify-content-between'>
                                <button className='btn btn-success'><VisibilityIcon /></button>
                                <button className='btn btn-warning'><EditIcon /></button>
                                <button className='btn btn-danger'><ArchiveIcon /></button>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                            <td>@mdo</td>
                            <td className='d-flex justify-content-between'>
                                <button className='btn btn-success'><VisibilityIcon /></button>
                                <button className='btn btn-warning'><EditIcon /></button>
                                <button className='btn btn-danger'><ArchiveIcon /></button>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td colSpan="2">Larry the Bird</td>
                            <td>@twitter</td>
                            <td>@mdo</td>
                            <td className='d-flex justify-content-between'>
                                <button className='btn btn-success'><VisibilityIcon /></button>
                                <button className='btn btn-warning'><EditIcon /></button>
                                <button className='btn btn-danger'><ArchiveIcon /></button>
                            </td>
                        </tr>

                    </tbody>
                </table>

            </div>
        </div>
    )
}

export default Home