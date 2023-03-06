import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchModuleReportLineData } from "../api/lecturer.api";
import Layout from "../components/layout";
import LineChart from "../components/lineChart";

const ModuleReport = () => {
  const { module_id } = useParams();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [linedata, setLinedata] = useState([]);

  useEffect(() => {
    (async () => {
      await fetchModuleReportLineData(module_id).then((res) => {
        setSessions(res.data.sessions);
        setLinedata({
          labels: res.data.sessions.map((session) => session.session_name),
          datasets: [
            {
              label: ["Attendance"],
              data: res.data.sessions.map((session) => session.count),
              backgroundColor: ["green"],
            },
          ],
        });
      });

      setLoading(false);
    })();
  }, []);

  return loading ? (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  ) : (
    <Layout>
      <LineChart chartData={linedata}></LineChart>
    </Layout>
  );
};

export default ModuleReport;
