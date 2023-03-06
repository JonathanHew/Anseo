import React, { useEffect, useState } from "react";
import { fetchUserModules } from "../api/lecturer.api";
import Layout from "../components/layout";

const Modules = () => {
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
    <Layout>Modules Page</Layout>
  );
};

export default Modules;
