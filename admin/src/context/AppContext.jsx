import { createContext } from "react";

export const AppContext = createContext()

const AppContextProvider = (props) =>{

 const currency = '$';
 const calculateAge = (dob) => {

    if (!dob || dob === "Not Selected") {
        return "N/A";
    }

    const birthDate = new Date(dob);

    if (isNaN(birthDate.getTime())) {
        return "N/A";
    }

    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const month = today.getMonth() - birthDate.getMonth();

    if (
        month < 0 ||
        (month === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
};

const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

  const slotDataFormat = (slotData) => {
    const dateArray = slotData.split('_')
    return dateArray[0]+" " +months[Number(dateArray[1])] + " " + dateArray[2]
   }



    const value = {
        calculateAge,
        slotDataFormat,
        currency
    }

     return  (
        <AppContext.Provider value={value}>
          {props.children}
        </AppContext.Provider>
     )
}

export default AppContextProvider;