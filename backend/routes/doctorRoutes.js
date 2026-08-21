import express from 'express'
import { doctorList,loginDoctor,appointmentsDoctor,appointmentComplete,appointmentCancel,doctordashboard, doctorProfile,updateDoctorProfile, getDoctorPatients } from '../controllers/doctorControllers.js'
import authdoctor from '../middlewares/authDoctor.js'

const doctorRouter = express.Router()

doctorRouter.get('/list',doctorList)
doctorRouter.post('/login',loginDoctor)
doctorRouter.get('/appointments',authdoctor,appointmentsDoctor)
doctorRouter.post('/complete-appointment',authdoctor,appointmentComplete)
doctorRouter.post('/cancel-appointment',authdoctor,appointmentCancel)
doctorRouter.get('/dashboard',authdoctor,doctordashboard)
doctorRouter.get('/profile',authdoctor,doctorProfile)
doctorRouter.post('/update-profile',authdoctor,updateDoctorProfile)
doctorRouter.get('/patients',authdoctor,getDoctorPatients)

export default doctorRouter