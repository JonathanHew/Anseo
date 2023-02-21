import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";

const SessionList = ({ sessions }) => {
  
  return (
    <Fragment>
      <h4 className="text-center mt-5">Sessions</h4>
      <table className="table text-center">
        <thead>
          <tr>
            <th>Name</th>
            <th>PIN</th>
            <th>Date</th>
            <th>Time</th>
            <th>Module</th>
          </tr>
        </thead>
        <tbody>
          {
            /*
            <tr>
              <td>Jonathans List</td>
              <td>26/01/2023</td>
              <td>17:00</td>
            </tr>
            */

            sessions.map((session) => (
              <tr key={session.session_id}>
                <td>
                  <NavLink to={`/join/${session.session_id}`}>
                    <span>{session.session_name}</span>
                  </NavLink>
                </td>
                <td>{session.session_pin}</td>
                <td>{session.session_date}</td>
                <td>{session.session_time}</td>
                <td>{session.module_name}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </Fragment>
  );
};

export default SessionList;
