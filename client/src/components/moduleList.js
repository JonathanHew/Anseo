import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";
import Dashboard from "../pages/dashboard";

const ModuleList = ({ modules, studentNumber }) => {
  return (
    <Fragment>
      <h4 className="text-center mt-5">Modules</h4>
      <p>{studentNumber}</p>
      <div class="list-group">
        {modules.map((module) => (
          <NavLink to={`/join/1`}>
            <button
              key={module.module_id}
              type="button"
              class="list-group-item list-group-item-action"
            >
              {module.module_name}
            </button>
          </NavLink>
        ))}
      </div>
    </Fragment>
  );
};

export default ModuleList;
