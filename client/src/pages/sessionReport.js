import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchStudentsInSession } from "../api/lecturer.api";
import Layout from "../components/layout";

const SessionReport = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { session_id } = useParams();

  useEffect(() => {
    (async () => {
      await fetchStudentsInSession(session_id).then((res) => {
        setStudents(res.data.students);
      });

      setLoading(false);
    })();
  }, []);
  return loading ? (
    <Layout>Loading ...</Layout>
  ) : (
    <Layout>Session Report</Layout>
  );
};

export default SessionReport;
