import express from 'express'
import {addDoctors,allDoctors,loginAdmin,appointmentAdmin, appointmentCancel,adminDashboard,getAllPatients} from '../controllers/adminControllers.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailablity } from '../controllers/doctorControllers.js';

const adminRouter = express.Router();

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctors)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availablity',authAdmin,changeAvailablity)
adminRouter.post('/appointments',authAdmin,appointmentAdmin)
adminRouter.post('/cancel-appointment',authAdmin,appointmentCancel)
adminRouter.get('/dashboard',authAdmin,adminDashboard)
adminRouter.get('/patients',authAdmin,getAllPatients)
export default adminRouter