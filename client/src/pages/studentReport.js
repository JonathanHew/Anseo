import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  fetchSignInsForStudentInModule,
  fetchStudentModuleReportLineData,
  fetchStudentModuleReportPieData,
} from "../api/lecturer.api";
import Layout from "../components/layout";
import PieChart from "../components/pieChart";
import { format, parseISO } from "date-fns";
import LineChart from "../components/lineChart";
import DoughnutChart from "../components/DoughnutChart";

const StudentReport = () => {
  const { student_number, module_id } = useParams();
  const [signins, setSignins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [piedata, setPiedata] = useState({});
  const [linedata, setLinedata] = useState({});
  const [percent, setPercent] = useState();
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
      console.log(signinContent.data.signins.length);
      console.log(signinContent.data.campusCount);
      setPercent(
        Math.round(
          (signinContent.data.campusCount / signinContent.data.signins.length) *
            100
        )
      );

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
              format(parseISO(session.session_date), "dd/MM/yyyy")
            ),
            datasets: [
              {
                label: "Attendance",
                data: res.data.sessions.map((session) => session.attended),
                backgroundColor: ["#87bc45"],
                borderColor: "#ea5545",
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
      <h1 className="text-center mt-2">{student_number} Student Report</h1>

      <div class="row text-center mt-5">
        <div class="col-sm-6">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Attendance</h5>
              <p class="card-text" style={{ fontSize: "50px" }}>
                {counts.attended}/{counts.total}
              </p>
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">On Campus</h5>
              <p class="card-text" style={{ fontSize: "50px" }}>
                {percent}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="container text-center" style={{}}>
        <h3 className="mt-5">Attendance History</h3>
        <div class="row">
          <div class="col-md-5">
            <DoughnutChart chartData={piedata}></DoughnutChart>
          </div>
          <div class="col-md-7 mt-5">
            <LineChart chartData={linedata} options={lineoptions}></LineChart>
          </div>
        </div>
      </div>
      <h4 className="text-center mt-5">Sign Ins</h4>
      <table className="table text-center">
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
                <NavLink to={`/join/${signin.session_id}`}>
                  <span>{signin.session_name}</span>
                </NavLink>
              </td>
              <td>{format(parseISO(signin.signin_date), "dd/MM/yyyy")}</td>
              <td>{signin.signin_time}</td>
              <td>{signin.signin_on_campus.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default StudentReport;
