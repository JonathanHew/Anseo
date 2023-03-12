import { useState } from "react";
import { onRegistration } from "../../api/auth";
import Layout from "../../components/Layout";
import "./style.css"

const Register = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      {
        const { data } = await onRegistration(values);
        setError("");
        setSuccess(data.message);
        setValues({ email: "", password: "" });
      }
    } catch (err) {
      console.error(err.response.data.errors[0].msg);
      setError(err.response.data.errors[0].msg);
      setSuccess("");
    }
  };

  return (
    <Layout>
      <div id="register-form">
        <h1 className="card-title text-center">Register</h1>
        <p className="card-text text-center">
          Register to use all our cool features ✌️
        </p>
        <div className="card">
          <div className="card-body">
            <form onSubmit={(e) => onSubmit(e)} className="container mt-3">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  onChange={(e) => onChange(e)}
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={values.email}
                  placeholder="example@gmail.com"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  onChange={(e) => onChange(e)}
                  type="password"
                  value={values.password}
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="password"
                  required
                />
              </div>

              <div style={{ color: "red", margin: "10px 0" }}>{error}</div>
              <div style={{ color: "green", margin: "10px 0" }}>{success}</div>

              <button
                type="submit"
                className="btn btn-primary mt-3 mb-3"
                id="form-btn"
              >
                Register
              </button>
              <p className="text-muted text-center">Already a user? Login</p>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
