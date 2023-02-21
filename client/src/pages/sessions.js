import { useEffect, useState } from "react";
import { fetchUserModules, fetchUserSessions } from "../api/lecturer.api";
import Layout from "../components/layout";
import CreateSession from "../components/createSession";
import SessionList from "../components/sessionList";
import CreateModule from "../components/createModule";

const Sessions = ({ id }) => {
  const [sessions, setSessions] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <Layout>
      <h1>Sessions Page</h1>
      <p>User ID: {id}</p>

      <CreateSession id={id} />

      <CreateModule id={id} />

      <SessionList sessions={sessions} />
    </Layout>
  );
};

export default Sessions;
