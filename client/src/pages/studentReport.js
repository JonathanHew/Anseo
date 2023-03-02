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
        }
      );

      await fetchStudentModuleReportLineData(student_number, module_id).then(
        (res) => {
          console.log(res);
          setLinedata({
            labels: res.data.sessions.map((session) =>
              format(parseISO(session.session_date), "dd/MM/yyyy")
            ),
            datasets: [
              {
                label: "Attendance",
                data: res.data.sessions.map((session) => session.attended),
                backgroundColor: ["#87bc45",],
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
      <div class="container text-center" style={{}}>
        <div class="row">
          <div class="col-md-5">
            <h4>Attendance Pie Chart</h4>
            <DoughnutChart chartData={piedata}></DoughnutChart>
          </div>
          <div class="col-md-7 mt-5">
            <h4>Attendance Line Chart</h4>
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
