import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  fetchSessionsForModule,
  fetchSignInsForStudentInModule,
  fetchStudentModuleReportData,
} from "../api/lecturer.api";
import Layout from "../components/layout";
import PieChart from "../components/pieChart";

const StudentReport = () => {
  const { student_number, module_id } = useParams();
  const [signins, setSignins] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [piedata, setPiedata] = useState({});

  useEffect(() => {
    (async () => {
      const signinContent = await fetchSignInsForStudentInModule(
        student_number,
        module_id
      );
      setSignins(signinContent.data.signins);

      const sessionContent = await fetchSessionsForModule(module_id);
      setSessions(sessionContent.data.sessions);

      await fetchStudentModuleReportData(
        student_number,
        module_id
      ).then((res) => {
        console.log(res);
        setPiedata({
          labels: ["Attended", "Not Attended"],
          datasets: [
            {
              label: "Number",
              data: [
                res.data.attendedCount,
                res.data.missedCount,
              ],
              backgroundColor: ["#87bc45", "#ea5545"],
              borderColor: "black",
              borderWidth: 1,
            },
          ],
        })
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
      <PieChart chartData={piedata}></PieChart>
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
          {
            /*
            <tr>
              <td>Jonathans List</td>
              <td>26/01/2023</td>
              <td>17:00</td>
            </tr>
            */

            signins.map((signin) => (
              <tr key={signin.signin_id}>
                <td>
                  <NavLink to={`/join/${signin.session_id}`}>
                    <span>{signin.session_name}</span>
                  </NavLink>
                </td>
                <td>{signin.signin_date}</td>
                <td>{signin.signin_time}</td>
                <td>{signin.signin_on_campus.toString()}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </Layout>
  );
};

export default StudentReport;
