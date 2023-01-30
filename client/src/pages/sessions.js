import { useEffect, useState } from "react";
import { fetchUserSessions } from "../api/lecturer.api";
import Layout from "../components/layout";
import CreateSession from "../components/createSession";

const Sessions = ({ id }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const content = await fetchUserSessions({ id });
      setSessions(content.data.sessions);
      setLoading(false);
    })();
  }, []);

  return loading ? (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  ) : (
    <Layout>
      <h1>Sessions Page</h1>
      <p>User ID: {id}</p>

      <CreateSession id={id}/>
      <table className="table mt-5 text-center">
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
