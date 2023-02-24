import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";
import Dashboard from "../pages/dashboard";

const ModuleList = ({ modules }) => {
  return (
    <Fragment>
      <h4 className="text-center mt-5">Modules</h4>
      <div class="list-group">
        {modules.map((module) => (
          <NavLink to={'/dashboard'}>
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
