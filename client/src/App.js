import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import AddData from './components/AddData';
import EditData from './components/EditData';
import ViewData from './components/ViewData';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Register' element={<Register />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/AddData' element={<AddData />} />
        <Route path='/EditData/:id' element={<EditData />} />
        <Route path='/ViewData/:id' element={<ViewData />} />
      </Routes>
    </>
  );
}

export default App;
