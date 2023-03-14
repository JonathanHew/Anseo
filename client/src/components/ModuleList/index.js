import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";

const ModuleList = ({ modules, studentNumber }) => {
  return (
    <Fragment>
      <div className="list-group mt-1">
        {modules.map((module) => (
          <NavLink to={`/student-report/${studentNumber}/${module.module_id}`} className="remove-decoration">
            <button
              key={module.module_id}
              type="button"
              className="list-group-item list-group-item-action"
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
