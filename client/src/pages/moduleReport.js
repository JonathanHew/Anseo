import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  fetchModuleInfo,
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
  const [module, setModule] = useState("");
  const [baroptions, setBaroptions] = useState({
    scales: {
      x: {
        title: {
          display: true,
          text: '# of Students'
        }
      },
      y: {
        title: {
          display: true,
          text: '# of Sessions'
        }
      }
    }    
  });

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

      await fetchModuleInfo(module_id).then((res) => {
        setModule(res.data.sessions[0].module_name);
      });

      await fetchModuleReportBarData(module_id).then((res) => {
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
      <h1 className="text-center">{module} Report</h1>
      <div class="container text-center mt-5" style={{}}>
        <div class="row">
          <div class="col-md-6">
            <h4>Students in Sessions</h4>
            <BarChart chartData={bardata} options={baroptions}></BarChart>
          </div>
          <div class="col-md-6">
            <h4>Session History</h4>
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
