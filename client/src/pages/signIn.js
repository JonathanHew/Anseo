import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { onSignIn } from "../api/signIn.api";
import Layout from "../components/layout";

const SignIn = () => {
  const { id } = useParams();

  const [values, setValues] = useState({
    name: "",
    number: "",
    session_id: id,
    longitude: undefined,
    latitude: undefined,
  });

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const geo = navigator.geolocation;
    if (!geo) {
      console.log("Geolocation is not supported on your browser!");
      setError("Geolocation is not supported on your browser. Please notify your lecturer!")
    }

    geo.getCurrentPosition((pos) => {
      console.log(pos);
      setValues({ ...values, longitude: pos.coords.longitude, latitude: pos.coords.latitude });
    }, () => {
      console.log("Unable to fetch location!");
      setError("Could not fetch location. Please refresh the page and make sure you click allow on the location services popup. If this proceeds please notify your lecturer!")
    })
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      {
        const { data } = await onSignIn(values);
        setError("");
        setSuccess(data.message);
        setValues({ name: "", number: "" });
      }
    } catch (err) {
      console.error(err.response.data.errors[0].msg);
      setError(err.response.data.errors[0].msg);
      setSuccess("");
    }
  };

  return (
    <Layout>
      <form onSubmit={(e) => onSubmit(e)} className="container mt-3">
        <h1>Sign Into Class</h1>

        <div className="mb-3">
          <label htmlFor="number" className="form-label">
            Student Number
          </label>
          <input
            onChange={(e) => onChange(e)}
            type="text"
            className="form-control"
            id="number"
            name="number"
            value={values.number.toUpperCase()}
            placeholder="C12345678"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            First Name
          </label>
          <input
            onChange={(e) => onChange(e)}
            type="text"
            value={values.name}
            className="form-control"
            id="name"
            name="name"
            placeholder="name"
            required
          />
        </div>

        <div style={{ color: "red", margin: "10px 0" }}>{error}</div>
        <div style={{ color: "green", margin: "10px 0" }}>{success}</div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </Layout>
  );
};

export default SignIn;
