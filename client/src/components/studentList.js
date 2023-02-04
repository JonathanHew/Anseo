import React, { Fragment } from 'react'

const StudentList = ({students, sessionToggle}) => {
  return (
    <Fragment>
        <h1>Students Signed In: {students.length}</h1>
      <button
        type="button"
        className="btn btn-success"
        onClick={(e) => sessionToggle(e)}
      >
        Start Session
      </button>
      <table className="table mt-5 text-center">
        <thead>
          <tr>
            <th>Student Number</th>
            <th>Name</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {
            /*
           <tr>
             <td>C19472842</td>
             <td>Jonathan</td>
             <td>02/02/23</td>
             <td>13:00</td>
           </tr>
           */

            students.map((student) => (
              <tr key={student.signin_id}>
                <td>{student.signin_number}</td>
                <td>{student.signin_name}</td>
                <td>{student.signin_date}</td>
                <td>{student.signin_time}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </Fragment>
  )
}

export default StudentList