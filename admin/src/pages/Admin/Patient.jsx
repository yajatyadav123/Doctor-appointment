import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const Patient = () => {

  const { aToken, patients, getpatients } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getpatients()
    }
  }, [aToken])

  return (
    <div className="m-5">

      <h1 className="text-2xl font-semibold text-gray-700 mb-5">
        My Patients
      </h1>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-sm text-left text-gray-600">

            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">
                  #
                </th>

                <th className="px-6 py-4">
                  Patient Name
                </th>

                <th className="px-6 py-4">
                  Email
                </th>

                <th className="px-6 py-4">
                  Phone
                </th>
              </tr>
            </thead>

            <tbody>

              {patients && patients.length > 0 ? (

                patients.map((patient, index) => (

                  <tr
                    key={patient._id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >

                    <td className="px-6 py-4">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-700">
                      {patient.name}
                    </td>

                    <td className="px-6 py-4">
                      {patient.email}
                    </td>

                    <td className="px-6 py-4">
                      {patient.phone || 'N/A'}
                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No patients found
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}

export default Patient