import React, { Fragment, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { format, parseISO } from "date-fns";
import "./style.css";

const SessionList = ({ sessions }) => {
  return (
    <Fragment>
      <div className="table-responsive">
        <table className="table text-center" id="sessionTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Date</th>
              <th>Time</th>
              <th>Module</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {sessions.map((session) => (
              <tr key={session.session_id}>
                <td>
                  <NavLink to={`/session/${session.session_id}`}>
                    <span>{session.session_name}</span>
                  </NavLink>
                </td>
                <td>{session.session_is_active.toString()}</td>
                <td>{format(parseISO(session.session_date), "dd/MM/yyyy")}</td>
                <td>{session.session_time}</td>
                <td>{session.module_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default SessionList;
