import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";

const ModuleList = ({ modules, studentNumber }) => {
  return (
    <Fragment>
      <h4 className="text-center mt-5">Modules</h4>
      
      <div class="list-group">
        {modules.map((module) => (
          <NavLink to={`/student-report/${studentNumber}/${module.module_id}`}>
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
