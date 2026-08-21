import React from 'react'
import { Route,Routes } from 'react-router-dom';
import Home from './pages/Home';
import Doctor from './pages/Doctor';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import Myprofile from './pages/Myprofile';
import Navbar from './components/Navbar/Navbar';
import Myappointments from './pages/Myappointments';
import Appointments from './pages/Appointments';
import Footer from './components/Footer/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
export const App = () => {
  return (

    
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer/>
      <Navbar/>
      <Routes>
        <Route path='/' element ={<Home/>} />
        <Route path='/doctor' element ={<Doctor/>} />
        <Route path='/doctor/:speciality' element ={<Doctor/>} />
        <Route path='/login' element ={<Login/>} />
        <Route path='/about' element ={<About/>} />
        <Route path='/contact' element ={<Contact/>} />
        <Route path='/my-profile' element ={<Myprofile/>} />
        <Route path='/my-appointments' element ={<Myappointments/>} />
        <Route path='/appointment/:docId' element ={<Appointments/>} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default App;