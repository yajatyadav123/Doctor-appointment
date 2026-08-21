import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'

const Patients = () => {

  const { dToken, patients, getpatients } = useContext(DoctorContext)

  useEffect(() => {
    if (dToken) {
      getpatients()
    }
  }, [dToken])

  return (
    <div className='m-5'>

      <h1 className='text-2xl font-semibold text-gray-700 mb-5'>
        My Patients
      </h1>

      <div className='bg-white rounded-lg border border-gray-200'>

        {patients.length > 0 ? (

          patients.map((patient) => (

            <div
              key={patient._id}
              className='flex items-center gap-4 p-4 border-b border-gray-100'
            >

              <img
                alt={patient.name}
                className='w-10 h-10 rounded-full object-cover'
              />

              <div>
                <p className='text-gray-700 font-medium'>
                  {patient.name}
                </p>

                <p className='text-sm text-gray-500'>
                  {patient.email}
                </p>
              </div>

            </div>

          ))

        ) : (

          <p className='p-5 text-gray-500'>
            No patients found
          </p>

        )}

      </div>

    </div>
  )
}

export default Patients