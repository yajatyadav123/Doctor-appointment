import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import {connectDb} from './config/mongodb.js';
import path from "path";

import adminRouter from './routes/adminRoutes.js';
import doctorRouter from './routes/doctorRoutes.js';
import userRouter from './routes/userRoutes.js';
// app config
const app = express();
const port = process.env.PORT || 4000
connectDb()


// middleware
app.use(express.json());
app.use(cors())
app.use('/uploads', express.static('uploads'));


app.use(
    '/uploads',
    express.static(path.join(process.cwd(), 'uploads'))
);

// api endpoints
app.use(express.urlencoded({ extended: true }));
app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)
app.get('/',(req,res)=>{
    res.send('API WORKING')
})
app.listen(port, ()=> console.log("Server Started",port))