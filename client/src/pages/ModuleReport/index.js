import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  fetchModuleInfo,
  fetchModuleReportBarData,
  fetchModuleReportLineData,
} from "../../api/lecturer.api";
import BarChart from "../../components/BarChart";
import Layout from "../../components/Layout";
import LineChart from "../../components/LineChart";
import { format, parseISO } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsersViewfinder,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";

const ModuleReport = () => {
  const { module_id } = useParams();
  const [sessions, setSessions] = useState([]);
  const [count, setCount] = useState();
  const [average, setAverage] = useState();
  const [loading, setLoading] = useState(true);
  const [linedata, setLinedata] = useState([]);
  const [bardata, setBardata] = useState([]);
  const [module, setModule] = useState("");
  const [baroptions, setBaroptions] = useState({
    scales: {
      x: {
        title: {
          display: true,
          text: "# of Students",
        },
      },
      y: {
        title: {
          display: true,
          text: "# of Sessions",
        },
      },
    },
  });

  useEffect(() => {
    (async () => {
      await fetchModuleReportLineData(module_id).then((res) => {
        setSessions(res.data.sessions);
        setCount(res.data.sessions.length);
        setAverage(res.data.average);
        setLinedata({
          labels: res.data.sessions.map((session) =>
            format(parseISO(session.session_date), "dd/MM/yyyy")
          ),
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
      <h1 className="text-center mt-5">{module} Module Report</h1>

      <div className="w-75 m-auto mt-4">
        <div class="row text-center mt-3">
          <div class="col-sm-6">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Sessions</h5>
                <div id="block">
                  <FontAwesomeIcon icon={faUsersViewfinder} size="3x" />

                  <span className="card-text ms-1" style={{ fontSize: "50px" }}>
                    {count}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-6 ">
            <div class="card ">
              <div class="card-body">
                <h5 class="card-title">Avg Attendance</h5>
                <div id="block">
                  <FontAwesomeIcon icon={faUserCheck} size="3x" />

                  <span className="card-text ms-1" style={{ fontSize: "50px" }}>
                    {average}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container text-center mt-5" style={{}}>
        <div class="row">
          <div class="col-md-6">
            <div className="card">
              <div className="card-body">
                <h4>Students in Sessions</h4>
                <BarChart chartData={bardata} options={baroptions}></BarChart>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h4>Session History</h4>
                <LineChart chartData={linedata}></LineChart>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card mt-5">
        <div className="card-body">
          <h4 className="text-center mt-1">Sessions</h4>
          <div className="table-responsive">
            <table className="table text-center table-hover" id="sessionTable">
              <thead>
                <tr>
                  <th>Session</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {sessions.map((session) => (
                  <tr key={session.session_id}>
                    <td>
                      <NavLink
                        to={`/session/${session.session_id}`}
                        className="remove-decoration color-black"
                      >
                        <span>{session.session_name}</span>
                      </NavLink>
                    </td>
                    <td>
                      {format(parseISO(session.session_date), "dd/MM/yyyy")}
                    </td>
                    <td>{session.session_time}</td>
                    <td>{session.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ModuleReport;
