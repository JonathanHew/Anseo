import { useEffect, useState } from "react";
import Layout from "../components/layout";
import { NavLink } from "react-router-dom";
import { fetchUserModules, fetchUserSessions } from "../api/lecturer.api";
import CreateSession from "../components/createSession";
import CreateModule from "../components/createModule";
import SessionList from "../components/sessionList";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    (async () => {
      const sessionContent = await fetchUserSessions();
      setSessions(sessionContent.data.sessions);
      const moduleContent = await fetchUserModules();
      setModules(moduleContent.data.modules);
      setLoading(false);
    })();
  }, []);

  return loading ? (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  ) : (
    <div>
      <Layout>
        <h1>Dashboard</h1>
        <p>Welcome: TESTUSER</p>

        <CreateSession modules={modules} />

        <CreateModule />

        <SessionList sessions={sessions} />
        <br></br>
        <label>Student Report:</label>
        <NavLink to="/search" className="mx-3">
          <span>Search</span>
        </NavLink>
        <br></br>
        <label>Module Report:</label>
        <NavLink to="/modules" className="mx-3">
          <span>Select</span>
        </NavLink>
        <br></br>
        <label>Session Report:</label>
        <NavLink to="/select-session" className="mx-3">
          <span>Select</span>
        </NavLink>
      </Layout>
    </div>
  );
};

export default Dashboard;
