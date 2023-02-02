import Layout from "../components/layout";
import QRCode from "react-qr-code";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchStudentsInSession } from "../api/lecturer.api";

const Join = () => {
  const { id } = useParams();
  const url = "http://localhost:3000/sign-in/" + id;
  const [active, setActive] = useState();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const content = await fetchStudentsInSession(id);
      setStudents(content.data.students);
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
  }, []);

  return loading ? (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  ) : active ? (
    <Layout>
      <div class="container text-center">
        <h1>Sign in by scanning the QR code!</h1>
        <div
          style={{
            height: "auto",
            margin: "4% auto",
            maxWidth: 450,
            width: "100%",
          }}
        >
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={url}
            viewBox={`0 0 256 256`}
          />
        </div>
        <h4>Student Count: {students.length}</h4>
      </div>
    </Layout>
  ) : (
    <Layout>
      <h1>Students Signed In: {students.length}</h1>
      <table className="table mt-5 text-center">
        <thead>
          <tr>
            <th>Student Number</th>
            <th>Name</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {
            /*
           <tr>
             <td>C19472842</td>
             <td>Jonathan</td>
             <td>02/02/23</td>
             <td>13:00</td>
           </tr>
           */

            students.map((student) => (
              <tr key={student.signin_id}>
                <td>{student.signin_number}</td>
                <td>{student.signin_name}</td>
                <td>{student.signin_date}</td>
                <td>{student.signin_time}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </Layout>
  );
};

export default Join;
