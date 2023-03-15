import { useState } from "react";
import { onRegistration } from "../../api/auth";
import Layout from "../../components/Layout";
import "../../App.css";
import { NavLink } from "react-router-dom";
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
    <div className="container">
      <div id="register-form">
        <NavLink to={"/"} className="remove-decoration">
          <h1 className="text-center anseo-page-title">Anseo!</h1>
        </NavLink>
        <p className="card-text text-center text-white">
          Register to use all our cool features ✌️
        </p>
        <div className="card" style={{ maxWidth: "540px" }}>
          <div className="card-body">
            <form onSubmit={(e) => onSubmit(e)} className="container mt-3">
              <div class="row g-0 mb-3">
                <div className="col-md-12">
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

                <div className="mb-1">
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
                <div style={{ color: "green", margin: "10px 0" }}>
                  {success}
                </div>

                <button
                  type="submit"
                  className="btn btn-secondary mb-3"
                  id="register-btn"
                >
                  Register
                </button>
                <p className="text-muted text-center">
                  Already a user? Login{" "}
                  <NavLink to={"/login"}>
                    <span className="text-muted">here</span>
                  </NavLink>{" "}
                  !
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
