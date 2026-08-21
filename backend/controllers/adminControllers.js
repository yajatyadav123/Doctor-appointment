import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'
import doctorModel from '../models/doctorsModel.js'

// API for adding doctors
const addDoctors = async (req, res) => {
    try {

        console.log("req.body:", req.body);
        console.log("req.file:", req.file);

        const imagefile = req.file;

        const {
            name,
            email,
            password,
            speciality,
            degree,
            experience,
            about,
            fees,
            address
        } = req.body;

        // checking for all data
        if (
            !name ||
            !email ||
            !password ||
            !speciality ||
            !degree ||
            !experience ||
            !about ||
            !fees ||
            !address ||
            !imagefile
        ) {
            return res.json({
                success: false,
                message: "Missing Detail"
            });
        }

        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Please enter valid email"
            });
        }

        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Please Enter strong password"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);

        // Multer local image URL
        const imageUrl = `http://localhost:4000/uploads/${imagefile.filename}`;

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedpassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        };

        const newDoctor = new doctorModel(doctorData);

        await newDoctor.save();

        res.json({
            success: true,
            message: "Doctor added successfully"
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: error.message
        });

    }
}

// API for admin login 

const loginAdmin = async(req,res) =>{
    try{
        
        const{email,password} = req.body;
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
                const token = jwt.sign({email:email},process.env.JWT_SECRET);
                res.json({success:true,token})
        }
        else {
            res.json({success:false,message:"Invalid credentials"})
        }
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// API to get all doctors list for admin panel
const allDoctors = async(req,res) =>{
    try {

        const doctors = await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})
    }
    catch(error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


// API to get all appointment list 
const appointmentAdmin = async(req,res) =>{

    try {
      const appointments = await appointmentModel.find({})
      res.json({success:true,appointments})
    }
    catch(error){
       console.log(error)
        res.json({success:false,message:error.message})
    }
}

// API for appointment cancellation
const appointmentCancel  = async(req,res) =>{
      try {
         const userId = req.userId
         const {appointmentId} = req.body;
         const appointmentData = await appointmentModel.findById(appointmentId)
         
    

        if (!appointmentData) {
            return res.json({
                success: false,
                message: "Appointment not found"
            });
        }
         
        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

         // releasing doctor slot 
         const {docId,slotDate,slotTime} = appointmentData;
         const doctorData = await doctorModel.findById(docId)

         if (!doctorData) {
            return res.json({
                success: false,
                message: "Doctor not found"
            });
        }

         let slots_booked = doctorData.slots_booked

         slots_booked[slotDate] = slots_booked[slotDate].filter(e=> e !==slotTime)

         await doctorModel.findByIdAndUpdate(docId,{slots_booked})

         res.json({success:true,message:'Appointment Cancelled'})

      }   
      catch(error){
         console.log(error)
         res.json({success:false,message:error.message})
      }

}

// API to get admin dashboard data from admin panel
const adminDashboard = async (req,res) =>{

    try {
       
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData ={
           doctors:doctors.length,
           appointments:appointments.length,
           patients:users.length,
           latestAppointments:appointments.reverse().slice(0,5)
        }
        
        res.json({success:true,dashData})

    } catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const getAllPatients = async (req, res) => {
  try {

    // Get all appointments
    const appointments = await appointmentModel.find({});

    // Get unique patient IDs
    const userIds = [
      ...new Set(
        appointments.map((appointment) => appointment.userId.toString())
      )
    ];

    // Get each patient only once
    const patients = await userModel
      .find({
        _id: { $in: userIds }
      })
      .select("-password");

    res.json({
      success: true,
      patients
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message: error.message
    });
  }
};

export {addDoctors,loginAdmin,allDoctors,appointmentAdmin,appointmentCancel,adminDashboard,getAllPatients};