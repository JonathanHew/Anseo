import Layout from "../components/layout";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  fetchSessionStatus,
  fetchStudentsInSession,
  onSetSessionStatus,
} from "../api/lecturer.api";
import SessionQR from "../components/sessionQR";
import StudentList from "../components/studentList";

const Join = () => {
  const { id } = useParams();
  const [active, setActive] = useState();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const sessionToggle = async(e) => {
    e.preventDefault();
    try {
      const content = await onSetSessionStatus(id);
      setActive(content.data.result[0].session_is_active);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    (async () => {
      const content = await fetchStudentsInSession(id);
      setStudents(content.data.students);
      const content2 = await fetchSessionStatus(id);
      setActive(content2.data.result[0].session_is_active);
      setLoading(false);
    })();

    if (active) {
      let interval = setInterval(async () => {
        const content = await fetchStudentsInSession(id);
        setStudents(content.data.students);
      }, 5000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [active]);

  return loading ? (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  ) : active ? (
    <Layout>
      <SessionQR id={id} students={students} sessionToggle={sessionToggle}/>
    </Layout>
  ) : (
    <Layout>
      <StudentList students={students} sessionToggle={sessionToggle}/>
    </Layout>
  );
};

export default Join;
