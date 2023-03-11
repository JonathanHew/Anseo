import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { fetchUserModules } from "../../api/lecturer.api";
import Layout from "../../components/Layout";

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
      <h2 className="text-center mt-5 mb-4">Your Modules</h2>
      <div class="list-group">
        {modules.map((module) => (
          <NavLink to={`/module-report/${module.module_id}`}>
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
    </Layout>
  );
};

export default SelectModule;
