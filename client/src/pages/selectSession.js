import React, { useState } from "react";
import Layout from "../components/layout";

const SelectSession = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const sessionContent = await fetchUserSessions();
      setSessions(sessionContent.data.sessions);
      setLoading(false);
    })();
  }, []);

  return (
    <Layout>
      <h4 className="text-center mt-5">Select a Session</h4>
      <table className="table text-center">
        <thead>
          <tr>
            <th>Name</th>
            <th>PIN</th>
            <th>Date</th>
            <th>Time</th>
            <th>Module</th>
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
              <td>{session.session_pin}</td>
              <td>{format(parseISO(session.session_date), "dd/MM/yyyy")}</td>
              <td>{session.session_time}</td>
              <td>{session.module_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default SelectSession;
