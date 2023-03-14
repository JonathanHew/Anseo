import React, { Fragment, useEffect } from "react";
import { format, parseISO } from "date-fns";
import DeleteSignin from "../DeleteSignin";
import "../../App.css";


const SigninList = ({ name, students, sessionToggle }) => {
  return (
    <Fragment>
      <div className="text-center">
        <h1 className="mt-5">{name}</h1>
        <h4>Students Signed In: {students.length}</h4>
        <button
          type="button"
          className="btn btn-success mt-1"
          onClick={(e) => sessionToggle(e)}
        >
          Start Session
        </button>
      </div>
      <div className="card mt-5">
        <div className="card-body">
          <h2 className="text-center">Students</h2>
          <table className="table table-responsive mt-2 text-center">
            <thead>
              <tr>
                <th>Student Number</th>
                <th>Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Campus</th>
                <th> </th>
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
                    <td>
                      {format(parseISO(student.signin_date), "dd/MM/yyyy")}
                    </td>
                    <td>{student.signin_time}</td>
                    <td>{student.signin_on_campus.toString()}</td>
                    <td>
                      <DeleteSignin signin_id={student.signin_id} />
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
};

export default SigninList;
