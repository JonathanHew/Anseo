import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";

const SessionList = ({sessions}) => {
  return (
    <Fragment>
      <table className="table mt-5 text-center">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Time</th>
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
                <td>{session.session_date}</td>
                <td>{session.session_time}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </Fragment>
  );
};

export default SessionList;