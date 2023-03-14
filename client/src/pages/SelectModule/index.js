import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { fetchUserModules } from "../../api/lecturer.api";
import Layout from "../../components/Layout";
import "../../App.css"

const SelectModule = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const moduleContent = await fetchUserModules();
      setModules(moduleContent.data.modules);
      setLoading(false);
    })();
  }, []);
  return loading ? (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  ) : (
    <Layout>
      <h1 className="text-center mt-5 mb-4">Select a Module</h1>
      <div class="list-group mt-3">
        {modules.map((module) => (
          <NavLink to={`/module-report/${module.module_id}`} className="remove-decoration">
            <button
              key={module.module_id}
              type="button"
              className="list-group-item list-group-item-action"
              id="module-item"
            >
              {module.module_name}
            </button>
          </NavLink>
        ))}
      </div>
    </Layout>
  );
};

export default SelectModule;
