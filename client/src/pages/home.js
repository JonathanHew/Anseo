import { useState } from "react";
import Layout from "../components/layout";

const Home = () => {
  const [pin, setPin] = useState();
  const [error, setError] = useState("Error!");

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setError("");
    try {
      //const content = await fetchSessionsForStudent(number);
      //setSessions(content.data.sessions);
      //setNumber("");
      //setMessage("");
    } catch (err) {
      //console.error(err.response.data.errors[0].msg);
      //setError(err.response.data.errors[0].msg);
      //setSessions([]);
      //setMessage("No sessions available")
    }
  };

  return (
    <Layout>
      <h1>Home</h1>
      <p>Welcome to Anseo!</p>
      <div className="container text-center" style={{ width: "35%" }}>
        <div class="form-floating mt-5">
          <input
            type="text"
            class="form-control"
            id="floatingInput"
            placeholder="Session PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
          />
          <label for="floatingInput">Session PIN</label>
          <div style={{ color: "red", margin: "10px 0" }}>{error}</div>
          <button type="button" class="btn btn-secondary btn-lg mt-1 w-100">
            Join
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
