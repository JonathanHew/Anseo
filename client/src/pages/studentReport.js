import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSignInsForStudentInModule } from "../api/lecturer.api";
import Layout from "../components/layout";

const StudentReport = () => {
  const { student_number, module_id } = useParams();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    (async () => {
      const sessionContent = await fetchSignInsForStudentInModule(student_number, module_id);
      setSessions(sessionContent.data.signins);
      //setLoading(false);
    })();
  }, []);
  return (
    <Layout>

    </Layout>
  );
};

export default StudentReport;
