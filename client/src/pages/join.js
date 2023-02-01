import Layout from "../components/layout";
import QRCode from "react-qr-code";
import { useParams } from "react-router-dom";
import { useState } from "react";

const Join = () => {
  const { id } = useParams();
  const url = "http://localhost:3000/sign-in/" + id;
  const [active, setActive] = useState(false);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    (async () => {
      //const content = await fetchUserSessions({ id });
      //setSessions(content.data.sessions);
      //setLoading(false);
    })();
  }, []);

  return (
    <Layout>
      <h1>Sign in by scanning the QR code!</h1>
      <div
        style={{
          height: "auto",
          margin: "0 auto",
          maxWidth: 450,
          width: "100%",
        }}
      >
        <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%"}}
          value={url}
          viewBox={`0 0 256 256`}
        />
      </div>
      <p>Session ID URL is: {url}</p>
    </Layout>
  );
};

export default Join;
