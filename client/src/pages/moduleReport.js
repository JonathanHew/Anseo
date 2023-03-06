import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchModuleReportBarData,
  fetchModuleReportLineData,
} from "../api/lecturer.api";
import BarChart from "../components/barChart";
import Layout from "../components/layout";
import LineChart from "../components/lineChart";

const ModuleReport = () => {
  const { module_id } = useParams();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [linedata, setLinedata] = useState([]);
  const [bardata, setBardata] = useState([]);

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

      await fetchModuleReportBarData(module_id).then((res) => {
        //console.log(Object.keys(res.data.counts)); ['0', '1', '2', '4']
        setBardata({
          labels: Object.keys(res.data.counts),
          datasets: [
            {
              label: "Sessions",
              data: Object.values(res.data.counts),
              backgroundColor: ["red", "yellow", "orange", "green", "blue"],
              borderColor: "black",
              borderWidth: 1,
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
      <BarChart chartData={bardata}></BarChart>
      <LineChart chartData={linedata}></LineChart>
    </Layout>
  );
};

export default ModuleReport;
