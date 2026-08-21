import doctorModel from "../models/doctorsModel.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import { listAppointments } from "./userControllers.js";

const changeAvailablity = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    return res.json({ success: true, message: "Availablity Changed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for Login doctor

const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.json({ success: false, message: "Invalid Credential" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);

    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const appointmentsDoctor = async (req, res) => {
  try {
    console.log("========== APPOINTMENTS DOCTOR ==========");

    console.log("Doctor ID from JWT:");
    console.log(req.doctorId);

    // Get ALL appointments
    const allAppointments = await appointmentModel.find({});

    console.log("ALL APPOINTMENTS:");
    console.log(allAppointments);

    console.log("DOC IDs STORED IN APPOINTMENTS:");

    allAppointments.forEach((appointment) => {
      console.log(appointment.docId);
    });

    // Find appointments for logged-in doctor
    const appointments = await appointmentModel.find({
      docId: req.doctorId,
    });

    console.log("MATCHING APPOINTMENTS:");
    console.log(appointments);

    console.log("NUMBER OF MATCHING APPOINTMENTS:");
    console.log(appointments.length);

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.log("APPOINTMENT ERROR:", error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to mark appointment to complete  for doctor panel
// API to mark appointment as completed for doctor panel
const appointmentComplete = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Doctor ID comes from authdoctor middleware
    if (appointmentData.docId.toString() !== req.doctorId.toString()) {
      return res.json({
        success: false,
        message: "Not authorized",
      });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      isCompleted: true,
    });

    return res.json({
      success: true,
      message: "Appointment Completed",
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to mark appointment as cancelled for doctor panel
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Doctor ID comes from authdoctor middleware
    if (appointmentData.docId.toString() !== req.doctorId.toString()) {
      return res.json({
        success: false,
        message: "Not authorized",
      });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    return res.json({
      success: true,
      message: "Appointment Cancelled",
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to get dashboard for doctor panel

const doctordashboard = async (req, res) => {
  try {
    const docId = req.doctorId;
    const appointments = await appointmentModel.find({ docId });
    let earnings = 0;

    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });
    let patients = [];

    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashdata = {
      earnings,
      appointments: appointments.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData: dashdata });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to get doctor profile
// API to get doctor profile
const doctorProfile = async (req, res) => {
  try {

    const docId = req.doctorId;

    const profile = await doctorModel
      .findById(docId)
      .select("-password");

    if (!profile) {
      return res.json({
        success: false,
        message: "Doctor not found"
      });
    }

    res.json({
      success: true,
      profileData: profile
    });

  } catch (error) {

    console.log(error);

    return res.json({
      success: false,
      message: error.message
    });
  }
};

// API to update profile data from doctor panel

// API to update profile data from doctor panel
const updateDoctorProfile = async (req, res) => {
  try {

    const { fees, address, available } = req.body;

    const docId = req.doctorId;

    await doctorModel.findByIdAndUpdate(
      docId,
      {
        fees,
        address,
        available
      }
    );

    res.json({
      success: true,
      message: "Profile Updated"
    });

  } catch (error) {

    console.log(error);

    return res.json({
      success: false,
      message: error.message
    });
  }
};

const getDoctorPatients = async (req, res) => {
  try {
    const docId = req.doctorId;

    const appointments = await appointmentModel.find({ docId });

    const userIds = [
      ...new Set(
        appointments.map((appointment) => appointment.userId.toString())
      )
    ];

    const patients = await userModel
      .find({ _id: { $in: userIds } })
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

export {
  changeAvailablity,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentComplete,
  appointmentCancel,
  doctordashboard,
  doctorProfile,updateDoctorProfile,
  getDoctorPatients
};
