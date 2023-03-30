import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  fetchModuleInfo,
  fetchSignInsForStudentInModule,
  fetchStudentModuleReportLineData,
  fetchStudentModuleReportPieData,
} from "../../api/lecturer.api";
import Layout from "../../components/Layout";
import { format, parseISO } from "date-fns";
import LineChart from "../../components/LineChart";
import DoughnutChart from "../../components/DoughnutChart";
import {
  faClipboardUser,
  faBuildingCircleCheck,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StudentReport = () => {
  const { student_number, module_id } = useParams();
  const [signins, setSignins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [piedata, setPiedata] = useState({});
  const [linedata, setLinedata] = useState({});
  const [percent, setPercent] = useState();
  const [module, setModule] = useState("");
  const [counts, setCounts] = useState({
    attended: 0,
    notAttended: 0,
    total: 0,
  });

  const [lineoptions, setLineoptions] = useState({
    scales: {
      y: {
        ticks: {
          display: false,
        },
      },
    },
  });

  useEffect(() => {
    (async () => {
      const signinContent = await fetchSignInsForStudentInModule(
        student_number,
        module_id
      );
      setSignins(signinContent.data.signins);
      setPercent(
        Math.round(
          (signinContent.data.campusCount / signinContent.data.signins.length) *
            100
        )
      );

      await fetchModuleInfo(module_id).then((res) => {
        setModule(res.data.sessions[0].module_name);
      });

      await fetchStudentModuleReportPieData(student_number, module_id).then(
        (res) => {
          setPiedata({
            labels: ["Attended", "Not Attended"],
            datasets: [
              {
                label: "Number",
                data: [res.data.attendedCount, res.data.missedCount],
                backgroundColor: ["#87bc45", "#ea5545"],
              },
            ],
          });

          setCounts({
            attended: res.data.attendedCount,
            notAttended: res.data.missedCount,
            total: res.data.attendedCount + res.data.missedCount,
          });
        }
      );

      await fetchStudentModuleReportLineData(student_number, module_id).then(
        (res) => {
          setLinedata({
            labels: res.data.sessions.map((session) =>
              format(parseISO(session.session_date), "dd/MM/yy")
            ),
            datasets: [
              {
                label: "Attendance",
                data: res.data.sessions.map((session) => session.attended),
                backgroundColor: ["white"],
                borderColor: "#87bc45",
                borderWidth: 2,
              },
            ],
          });
        }
      );

      setLoading(false);
    })();
  }, []);
  return loading ? (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  ) : (
    <Layout>
      <h1 className="text-center mt-5">
        {student_number} Report For {module}
      </h1>

      <div className="w-75 m-auto mt-4">
        <div class="row text-center mt-3">
          <div class="col-sm-6">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Attendance</h5>
                <div id="block">
                  <FontAwesomeIcon icon={faClipboardUser} size="3x" />

                  <span className="card-text ms-1" style={{ fontSize: "50px" }}>
                    {counts.attended}/{counts.total}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-6 ">
            <div class="card ">
              <div class="card-body">
                <h5 class="card-title">On Campus</h5>
                <div id="block">
                  <FontAwesomeIcon icon={faBuildingCircleCheck} size="3x" />

                  <span className="card-text ms-1" style={{ fontSize: "50px" }}>
                    {percent}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container text-center mt-5" style={{}}>
        <div class="row">
          <div class="col-md-5">
            <div className="card">
              <div className="card-body">
                <h3>Attendance Record</h3>
                <DoughnutChart chartData={piedata}></DoughnutChart>
              </div>
            </div>
          </div>
          <div class="col-md-7 ">
            <div className="card h-100">
              <div className="card-body">
                <h3 className="mt-5">Attendance History</h3>
                <LineChart
                  chartData={linedata}
                  options={lineoptions}
                ></LineChart>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card mt-5">
        <div className="card-body">
          <h3 className="text-center mt-1">Sign Ins</h3>
          <div className="table-responsive">
            <table className="table text-center table-hover">
              <thead>
                <tr>
                  <th>Session</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Campus</th>
                </tr>
              </thead>
              <tbody>
                {signins.map((signin) => (
                  <tr key={signin.signin_id}>
                    <td>
                      <NavLink to={`/session/${signin.session_id}`} className="remove-decoration">
                        <span className="color-black">{signin.session_name}</span>
                      </NavLink>
                    </td>
                    <td>
                      {format(parseISO(signin.signin_date), "dd/MM/yyyy")}
                    </td>
                    <td>{signin.signin_time}</td>
                    <td>
                      {signin.signin_on_campus ? (
                        <FontAwesomeIcon
                          icon={faCircleCheck}
                          className="color-green"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faCircleXmark}
                          className="color-red"
                        />
                      )}
                    </td>
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

export default StudentReport;
