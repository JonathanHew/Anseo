import { useState } from "react";
import { onPinSubmit } from "../../api/signIn.api";
import Layout from "../../components/Layout";
import "../../App.css";

const Home = () => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const content = await onPinSubmit(pin);
      const session_id = content.data.result[0].session_id;
      console.log(session_id);
      window.location = `/sign-in/${session_id}`;
    } catch (err) {
      console.error(err.response.data.errors[0].msg);
      setError(err.response.data.errors[0].msg);
    }
  };

  return (
    <div className="container">
      <div id="home-div">
        <h1 className="text-center mb-3 ">Anseo!</h1>
        <div className="card" id="home-card">
          <div className="card-body">
            <div className="container text-center">
              <form onSubmit={onSubmitForm}>
                <div class="form-floating">
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
                  <button class="btn btn-secondary btn-lg mt-1 w-100">
                    Join
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <p className="mt-1 text-center text-muted" id="bottom-card-text">
          Are you a lecturer? Login or Register here!
        </p>
      </div>
    </div>
  );
};

export default Home;
