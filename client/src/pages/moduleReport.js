import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  fetchModuleReportBarData,
  fetchModuleReportLineData,
} from "../api/lecturer.api";
import BarChart from "../components/barChart";
import Layout from "../components/layout";
import LineChart from "../components/lineChart";
import { format, parseISO } from "date-fns";

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
          labels: res.data.sessions.map((session) => format(parseISO(session.session_date), "dd/MM/yyyy")),
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
              backgroundColor: [
                "#fd7f6f",
                "#7eb0d5",
                "#b2e061",
                "#bd7ebe",
                "#ffb55a",
                "#ffee65",
                "#beb9db",
                "#fdcce5",
                "#8bd3c7",
              ],
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
      <div class="container text-center mt-5" style={{}}>
        <div class="row">
          <div class="col-md-6">
            <h4>Module Attendance Bar Chart</h4>
            <BarChart chartData={bardata}></BarChart>
          </div>
          <div class="col-md-6">
            <h4>Module Attendance Line Chart</h4>
            <LineChart chartData={linedata}></LineChart>
          </div>
        </div>
      </div>
      <h4 className="text-center mt-5">Sessions</h4>
      <table className="table text-center">
        <thead>
          <tr>
            <th>Session</th>
            <th>Date</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.session_id}>
              <td>
                <NavLink to={`/join/${session.session_id}`}>
                  <span>{session.session_name}</span>
                </NavLink>
              </td>
              <td>{format(parseISO(session.session_date), "dd/MM/yyyy")}</td>
              <td>{session.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default ModuleReport;
