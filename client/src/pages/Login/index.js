import { useState } from "react";
import { onLogin } from "../../api/auth";
import Layout from "../../components/Layout";
import { useDispatch } from "react-redux";
import { authenticateUser } from "../../redux/slices/authSlice";
import "../styles.css";

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(false);

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const dispatch = useDispatch();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError();

    try {
      await onLogin(values);
      dispatch(authenticateUser());
      localStorage.setItem("isAuth", "true");
    } catch (err) {
      console.error(err.response.data.errors[0].msg);
      setError(err.response.data.errors[0].msg);
    }
  };

  return (
    <Layout>
      <div id="login-form">
        <h1 className="card-title text-center">Login</h1>
        <p className="card-text text-center">
          Login to enjoy all our cool features ✌️
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

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="flexCheck"
                />
                <label className="form-check-label" for="flexCheck">
                  Remember me
                </label>
              </div>

              <div style={{ color: "red", margin: "10px 0" }}>{error}</div>

              <button
                type="submit"
                className="btn btn-primary mt-1 mb-3"
                id="login-btn"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
