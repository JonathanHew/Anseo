import { format, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { fetchUserSessions } from "../../api/lecturer.api";
import Layout from "../../components/Layout";
import SessionList from "../../components/SessionList";

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
      <h1 className="text-center mt-5">Select a Session</h1>
      <div className="card mt-5">
        <div className="card-body">
          <SessionList sessions={sessions} url="session-report" />
        </div>
      </div>
    </Layout>
  );
};

export default SelectSession;
