import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  fetchSessionsForModule,
  fetchSignInsForStudentInModule,
} from "../api/lecturer.api";
import Layout from "../components/layout";

const StudentReport = () => {
  const { student_number, module_id } = useParams();
  const [signins, setSignins] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const signinContent = await fetchSignInsForStudentInModule(
        student_number,
        module_id
      );

      
      const sessionContent = await fetchSessionsForModule(module_id);
      setSignins(signinContent.data.signins);
      setSessions(sessionContent.data.sessions);
      setLoading(false);
    })();
  }, []);
  return loading ? (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  ) : (
    <Layout>
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
