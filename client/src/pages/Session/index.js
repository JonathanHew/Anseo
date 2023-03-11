import Layout from "../../components/Layout";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  fetchSessionInfo,
  fetchStudentsInSession,
  onSetSessionStatus,
} from "../../api/lecturer.api";
import QRcode from "../../components/QRcode";
import StudentList from "../../components/SigninList";

const Session = () => {
  const { id } = useParams();
  const [active, setActive] = useState();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");

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
      const content2 = await fetchSessionInfo(id);
      setActive(content2.data.result[0].session_is_active);
      setPin(content2.data.result[0].session_pin);
      setName(content2.data.result[0].session_name);
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
      <QRcode id={id} pin={pin} students={students} sessionToggle={sessionToggle}/>
    </Layout>
  ) : (
    <Layout>
      <StudentList name={name} students={students} sessionToggle={sessionToggle}/>
    </Layout>
  );
};

export default Session;
