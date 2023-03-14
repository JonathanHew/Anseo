import React, { Fragment, useEffect } from "react";
import { format, parseISO } from "date-fns";
import DeleteSignin from "../DeleteSignin";
import "../../App.css";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SigninList = ({ students }) => {
  return (
    <Fragment>
      <div className="card mt-5">
        <div className="card-body">
          <h2 className="text-center">Students</h2>
          <div className="table-responsive">
            <table className="table mt-2 text-center">
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
                {students.map((student) => (
                  <tr key={student.signin_id}>
                    <td>{student.signin_number}</td>
                    <td>{student.signin_name}</td>
                    <td>
                      {format(parseISO(student.signin_date), "dd/MM/yyyy")}
                    </td>
                    <td>{student.signin_time}</td>
                    <td>
                      {student.signin_on_campus ? (
                        <FontAwesomeIcon
                          icon={faCircleCheck}
                          className="color-green"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faCircleXmark}
                          className="color-red"
                        />
                      )}
                    </td>
                    <td>
                      <DeleteSignin signin_id={student.signin_id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default SigninList;
