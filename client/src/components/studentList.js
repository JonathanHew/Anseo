import React, { Fragment, useEffect } from "react";
import { format, parseISO } from "date-fns";

const StudentList = ({ name, students, sessionToggle }) => {
  return (
    <Fragment>
      <div className="text-center">
        <h1 className="mt-5">{name}</h1>
        <h4>Students Signed In: {students.length}</h4>
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
              <th>Campus</th>
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
                  <td>{format(parseISO(student.signin_date), "dd/MM/yyyy")}</td>
                  <td>{student.signin_time}</td>
                  <td>{student.signin_on_campus.toString()}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default StudentList;
