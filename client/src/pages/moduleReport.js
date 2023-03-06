import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchModuleReportLineData } from "../api/lecturer.api";
import Layout from "../components/layout";

const ModuleReport = () => {
  const { module_id } = useParams();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const sessionContent = await fetchModuleReportLineData(module_id);
      setSessions(sessionContent.data.sessions);
      setLoading(false);
    })();
  }, []);

  return <Layout>Module Report Page</Layout>;
};

export default ModuleReport;
