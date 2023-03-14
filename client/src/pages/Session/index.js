import Layout from "../../components/Layout";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  fetchSessionInfo,
  fetchStudentsInSession,
  onSetSessionStatus,
} from "../../api/lecturer.api";
import QRcode from "../../components/QRcode";
import SigninList from "../../components/SigninList";

const Session = () => {
  const { id } = useParams();
  const [active, setActive] = useState();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");

  const sessionToggle = async (e) => {
    e.preventDefault();
    try {
      const content = await onSetSessionStatus(id);
      setActive(content.data.result[0].session_is_active);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    (async () => {
      const content = await fetchStudentsInSession(id);
      console.log("students fetched!");
      setStudents(content.data.students);
      const content2 = await fetchSessionInfo(id);
      console.log("session info fetched");
      setActive(content2.data.result[0].session_is_active);
      setPin(content2.data.result[0].session_pin);
      setName(content2.data.result[0].session_name);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
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
      <div class="container text-center">
        <h1 className="mt-4">Sign in by scanning the QR code!</h1>
        <button
          type="button"
          className="btn btn-danger"
          onClick={(e) => sessionToggle(e)}
        >
          End Session
        </button>
        <div
          style={{
            height: "auto",
            margin: "4% auto",
            maxWidth: 450,
            width: "100%",
          }}
        >
          <QRcode id={id} />
        </div>
        <h4>Student Count: {students.length}</h4>
        <h5>PIN: {pin}</h5>
      </div>
    </Layout>
  ) : (
    <Layout>
      <div className="text-center">
        <h1 className="mt-5">{name}</h1>
        <h4>Students Signed In: {students.length}</h4>
        <button
          type="button"
          className="btn btn-success mt-1"
          onClick={(e) => sessionToggle(e)}
        >
          Start Session
        </button>
      </div>
      <SigninList students={students} />
    </Layout>
  );
};

export default Session;
