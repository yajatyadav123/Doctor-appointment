import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route,Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllApointments from './pages/Admin/AllApointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorList from './pages/Admin/DoctorList';
import { DoctorContext } from './context/DoctorContext';
import Doctordashboard from './pages/Doctor/Doctordashboard';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import Patients from './pages/Doctor/Patients';
import Patient from './pages/Admin/Patient';

const App = () => {

  const {aToken} = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext)

  return aToken || dToken ?(
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <Navbar />
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          {/* ADMIN Route*/}
          <Route path ='/' element={<></>} />
          <Route path ='/admin-dashboard' element={<Dashboard/>} />
          <Route path ='/all-appointments' element={<AllApointments/>} />
          <Route path ='/add-doctor' element={<AddDoctor/>} />
          <Route path ='/doctor-list' element={<DoctorList/>} />
          <Route path ='/patients-list' element={<Patient />} />
           {/* doctor Route*/}
            <Route path ='/doctor-dashboard' element={<Doctordashboard/>} />
            <Route path ='/doctor-appointments' element={<DoctorAppointments/>} />
            <Route path ='/doctor-profile' element={<DoctorProfile/>} />
            <Route path ='/doctor-patients' element={<Patients/>} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
     <Login/>
    <ToastContainer/>
    </>
  )
}
export default App