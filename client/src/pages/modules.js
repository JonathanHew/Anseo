import React, { useEffect, useState } from "react";
import { fetchUserModules } from "../api/lecturer.api";
import Layout from "../components/layout";

const Modules = () => {

  const [modules, setModules] = useState([]);

  useEffect(() => {
    (async () => {
      const moduleContent = await fetchUserModules();
      setModules(moduleContent.data.modules);
      //setLoading(false);
    })();
  }, []);
  return <Layout>Modules Page</Layout>;
};

export default Modules;
