import { createContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
export const AdminContext = createContext()

const AdminContextProvider = (props) =>{
    
    const[aToken,setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'');
    console.log("Admin Token:", aToken);
    const[doctors,setDoctors] = useState([])
    const[appointments,setAppointments] = useState([])
    const[dashData,setDashData] = useState(false)
    const [patients,setPatients] = useState([])
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const getAlldoctors = async () => {
    try {

        console.log("Token being sent:", aToken);

        const { data } = await axios.post(
            backendUrl + '/api/admin/all-doctors',
            {},
            {
                headers: {
                    atoken: aToken
                }
            }
        );

        console.log("All doctors response:", data);

        if (data.success) {
            setDoctors(data.doctors);
        } else {
            toast.error(data.message);
        }

    } catch (error) {
        console.log("API ERROR:", error);
        toast.error(error.message);
    }
};

    const changeAvailablity =  async (docId) =>{

        try {
          const {data} = await axios.post(backendUrl+'/api/admin/change-availablity',{docId},{headers:{aToken}})
          if(data.success){
            toast.success(data.message)
            getAlldoctors()
          }
          else {
            toast.error(error.message)
          }
        }
        catch(error){
           toast.error(error.message)
        }
    }

     const getAllAppointments = async () => {
      
      try {

        console.log("TOKEN BEFORE REQUEST:", aToken);

        const { data } = await axios.post(
            backendUrl + '/api/admin/appointments',
            {},
            {
                headers: {
                    atoken: aToken
                }
            }
        );

        console.log("ADMIN API RESPONSE:", data);

        if (data.success) {
            setAppointments(data.appointments);
        } else {
            toast.error(data.message);
        }

    } catch (error) {
        console.log("REQUEST ERROR:", error);
        toast.error(error.message);
    }
}
 
const cancelAppointment = async(appointmentId) => {

  try {
     
    const {data} = await axios.post(backendUrl+'/api/admin/cancel-appointment',{appointmentId},{headers:{ atoken:aToken}})
    
      if(data.success){
        toast.success(data.message)
        getAllAppointments()
      }
      else {
        toast.error(data.message)
      }
  }
  catch(error){
     toast.error(error.message);
  }

}

const getDashData = async() =>{
    
    try {
      const {data} = await axios.get(backendUrl+'/api/admin/dashboard',{headers:{atoken:aToken}})

      if(data.success){
        setDashData(data.dashData)
        console.log(data.dashData)
      }
      else {
        toast.error(data.message)
      }
    }
    catch(error){
        toast.error(error.message)
    }
}
  const getpatients = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/patients", {
        headers: { atoken: aToken },
      });

      if (data.patients) {
        setPatients(data.patients);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || error.message);
    }
  };



    const value = {
       aToken,setAToken,
       backendUrl,doctors,
       getAlldoctors,changeAvailablity,
       appointments,setAppointments,getAllAppointments,
       cancelAppointment,dashData,setDashData,getDashData,
       patients,setPatients,getpatients
    }
     return  (
        <AdminContext.Provider value={value}>
          {props.children}
        </AdminContext.Provider>
     )
}

export default AdminContextProvider;