import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken';
import doctorModel from '../models/doctorsModel.js';
import appointmentModel from '../models/appointmentModel.js';

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// API to register
const registerUser = async(req,res) =>{

     try {
         
        const {name,email,password} = req.body

        if(!name || !password || !email){
            return res.json({success:false,message:"Missing Detail"})
        }

        if(!validator.isEmail(email))
            
            {
            return res.json({success:false,message:"enter a valid email"})
        }
          
        const isExist = await userModel.findOne({ email });

        if (isExist) {
            return res.json({
                success: false,
                message: "User already exists"
            });
        }


        if(password.length < 8){
            return res.json({success:false,message:"enter a strong password"})
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(password,salt)

        const userData = {
            name,
            email,
            password:hashedpassword
        }
       
        const newUser = new  userModel(userData)
        const user = await newUser.save()

        const token =  jwt.sign({id:user._id},process.env.JWT_SECRET)

        res.json({success:true,token})

     }
     catch(error){
          console.log(error)
          res.json({success:false,message:error.message})
     }      
}

const loginUser = async(req,res) =>{

    try {
        const {email,password} = req.body;
        const user = await userModel.findOne({email})

        if(!user){
          return res.json({success:false,message:"User does not exist"})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(isMatch){
             const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
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


// API to get user profile data

const  getProfile = async(req,res) =>{

    try{
         
        const userId = req.userId;
        const userData = await userModel.findById(userId).select('-password')

        res.json({success:true,userData})

    }
    catch(error){
       console.log(error)
       res.json({success:false,message:error.message})
    }
}

// API to update user profile

const updateProfile = async(req,res) =>{
    try {

      const userId = req.userId;
      const {name,phone,address,dob,gender} = req.body
      const imagefile = req.file;
      
      if(!name  || !dob || !gender){
          return res.json({success:false,message:"Data Missing"})
      }

       const updateData = {
            name,
            phone,
            address: JSON.parse(address),
            dob,
            gender
        };

        // Save image filename if uploaded
        if (imagefile) {
            updateData.image = imagefile.filename;
        }

        await userModel.findByIdAndUpdate(userId, updateData);

     
      return res.json({
            success: true,
            message: "Profile Updated Successfully"
        });

    }
    catch(error){
      console.log(error)
      res.json({success:false,message:error.message})
    }
}

// API to book appointment
const bookappointment = async (req, res) => {
    try {

        const userId = req.userId;
        const { docId, slotDate, slotTime } = req.body;

        // Debug logs
        console.log("========== BOOK APPOINTMENT ==========");
        console.log("User ID:", userId);
        console.log("Doctor ID received:", docId);
        console.log("Slot Date:", slotDate);
        console.log("Slot Time:", slotTime);

        // Get doctor
        const docData = await doctorModel
            .findById(docId)
            .select('-password');

        console.log("Doctor found:", docData ? "YES" : "NO");

        if (!docData) {
            return res.json({
                success: false,
                message: "Doctor not found"
            });
        }

        // Check doctor availability
        if (!docData.available) {
            return res.json({
                success: false,
                message: "Doctor not available"
            });
        }

        // Check booked slots
        let slots_booked = docData.slots_booked;

        if (slots_booked[slotDate]) {

            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({
                    success: false,
                    message: "Slot not available"
                });
            }

            slots_booked[slotDate].push(slotTime);

        } else {

            slots_booked[slotDate] = [];
            slots_booked[slotDate].push(slotTime);

        }

        // Get user
        const userData = await userModel
            .findById(userId)
            .select('-password');

        if (!userData) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        // Remove slots_booked from doctor data
        delete docData.slots_booked;

        // Create appointment
        const appointmentData = {

            userId,

            // IMPORTANT
            // This is the doctor ID that will be stored
            // inside the appointment document
            docId,

            userData: {
                name: userData.name,
                email: userData.email,
                image: userData.image,
                address: userData.address,
                gender: userData.gender,
                dob: userData.dob,
                phone: userData.phone
            },

            docData,

            amount: docData.fees,

            slotTime,

            slotDate,

            date: Date.now()
        };

        console.log("========== APPOINTMENT DATA ==========");
        console.log("Appointment Doctor ID:", appointmentData.docId);
        console.log("Appointment User ID:", appointmentData.userId);

        // Create appointment
        const newAppointment =
            new appointmentModel(appointmentData);

        await newAppointment.save();

        console.log("Appointment saved successfully");
        console.log("Appointment ID:", newAppointment._id);

        // Update doctor's booked slots
        await doctorModel.findByIdAndUpdate(
            docId,
            {
                slots_booked
            }
        );

        res.json({
            success: true,
            message: "Appointment booked"
        });

    } catch (error) {

        console.log("BOOK APPOINTMENT ERROR:", error);

        res.json({
            success: false,
            message: error.message
        });
    }
};

// API to get user appointments for frontend my-appointments page
const listAppointments = async(req,res) =>{

    try {
        const userId = req.userId
        const appointments = await appointmentModel.find({userId:userId})
        res.json({success:true,appointments})  

    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// API to cancel appointment
const cancelAppointment  = async(req,res) =>{
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
         

         // verify appointment user 
         if(appointmentData.userId.toString() !== userId.toString()){
             return res.json({success:false,message:'Unauthorized action'})

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

// API to make payment using Stripe
const paymentStripe = async (req, res) => {
    try {

        const userId = req.userId;
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        // Appointment doesn't exist
        if (!appointmentData) {
            return res.json({
                success: false,
                message: "Appointment not found"
            });
        }

        // Check appointment belongs to logged-in user
        if (appointmentData.userId.toString() !== userId.toString()) {
            return res.json({
                success: false,
                message: "Unauthorized action"
            });
        }

        // Don't allow payment for cancelled appointment
        if (appointmentData.cancelled) {
            return res.json({
                success: false,
                message: "Appointment is cancelled"
            });
        }

        // Don't allow payment twice
        if (appointmentData.payment) {
            return res.json({
                success: false,
                message: "Appointment is already paid"
            });
        }

        // Create Stripe Checkout session
        const session = await stripe.checkout.sessions.create({

            payment_method_types: ['card'],

            line_items: [
                {
                    price_data: {
                        currency: 'usd',

                        product_data: {
                            name: 'Doctor Appointment'
                        },

                        // Stripe amount is in cents
                        unit_amount: Math.round(
                            Number(appointmentData.amount) * 100
                        )
                    },

                    quantity: 1
                }
            ],

            mode: 'payment',

            // Store appointment ID in Stripe
            metadata: {
                appointmentId: appointmentId.toString()
            },

            success_url:
                `${process.env.FRONTEND_URL}/my-appointments?payment=success&appointmentId=${appointmentId}`,

            cancel_url:
                `${process.env.FRONTEND_URL}/my-appointments`
        });

        // Save Stripe session ID in MongoDB
        await appointmentModel.findByIdAndUpdate(
            appointmentId,
            {
                stripeSessionId: session.id,
                paymentStatus: "pending"
            }
        );

        res.json({
            success: true,
            session_url: session.url
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: error.message
        });
    }
};

// API to verify Stripe payment
const verifyStripePayment = async (req, res) => {
    try {

        const userId = req.userId;
        const { appointmentId } = req.body;

        const appointmentData =
            await appointmentModel.findById(appointmentId);

        // Appointment doesn't exist
        if (!appointmentData) {
            return res.json({
                success: false,
                message: "Appointment not found"
            });
        }

        // Verify appointment belongs to logged-in user
        if (appointmentData.userId.toString() !== userId.toString()) {
            return res.json({
                success: false,
                message: "Unauthorized action"
            });
        }

        // Already paid
        if (appointmentData.payment) {
            return res.json({
                success: true,
                message: "Payment already verified"
            });
        }

        // Stripe session doesn't exist
        if (!appointmentData.stripeSessionId) {
            return res.json({
                success: false,
                message: "Stripe payment session not found"
            });
        }

        // Get payment information from Stripe
        const session =
            await stripe.checkout.sessions.retrieve(
                appointmentData.stripeSessionId
            );

        console.log(
            "Stripe payment status:",
            session.payment_status
        );

        // Payment successful
        if (session.payment_status === "paid") {

            await appointmentModel.findByIdAndUpdate(
                appointmentId,
                {
                    payment: true,
                    paymentStatus: "paid"
                }
            );

            return res.json({
                success: true,
                message: "Payment verified successfully"
            });
        }

        // Payment not completed
        return res.json({
            success: false,
            message: "Payment not completed"
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: error.message
        });
    }
};


export  {registerUser,loginUser,getProfile,updateProfile,bookappointment,listAppointments,cancelAppointment,paymentStripe,verifyStripePayment}


//  slots_booked[slotDate] = slots_booked[slotDate].filter(e=> e !==slotTime)  we are having three time 10:00,10:30,11:00
// when we are cancelling 11 we will keep 10 and 12