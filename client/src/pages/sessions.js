import { useEffect, useState } from "react";
import { fetchUserSessions } from "../api/lecturer.api";
import Layout from "../components/layout";

const Sessions = ({ id }) => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    (async () => {
      const content = await fetchUserSessions({ id });
      setSessions(content.data.sessions);
    })();
  }, []);

  return (
    <Layout>
      <h1>Sessions Page</h1>
      <p>User ID: {id}</p>

      <table class="table mt-5 text-center">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Time</th>
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

            sessions.map((session) => (
              <tr key={session.session_id}>
                <td>{session.session_name}</td>
                <td>{session.session_date}</td>
                <td>{session.session_time}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </Layout>
  );
};

export default Sessions;
