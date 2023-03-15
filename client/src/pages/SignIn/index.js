import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { fetchSessionInfo } from "../../api/lecturer.api";
import { onSignIn } from "../../api/signIn.api";
import Layout from "../../components/Layout";
import { TileLayer, MapContainer, Polygon } from "react-leaflet";
import L from "leaflet";
import "../../App.css";

const SignIn = () => {
  const { session_id } = useParams();

  const [values, setValues] = useState({
    name: "",
    number: "",
    session_id: session_id,
    longitude: undefined,
    latitude: undefined,
  });

  const [session, setSession] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [center] = useState({ lat: 53.356427, lng: -6.2817008 });
  const [map, setMap] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  let myLatLon;
  let locationMarker;
  const redOptions = { color: "red" };
  const tudPolygon = [
    [53.3567958, -6.2824093],
    [53.3560258, -6.2823074],
    [53.3560018, -6.2821116],
    [53.3563492, -6.2819935],
    [53.3562724, -6.2812506],
    [53.3562403, -6.2812533],
    [53.3562451, -6.281323],
    [53.3559282, -6.2814196],
    [53.3559586, -6.2818112],
    [53.3558289, -6.2818326],
    [53.3556895, -6.2811434],
    [53.3562098, -6.2809986],
    [53.356229, -6.2811381],
    [53.3562626, -6.2811327],
    [53.3562514, -6.2809879],
    [53.3563794, -6.2809581],
    [53.3564018, -6.2811297],
    [53.3566452, -6.28106],
    [53.3567958, -6.2824093],
  ];

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    (async () => {
      const sessionInfo = await fetchSessionInfo(session_id);
      setSession(sessionInfo.data.result[0].session_name);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const geo = navigator.geolocation;
    if (!geo) {
      console.log("Geolocation is not supported on your browser!");
      setError(
        "Geolocation is not supported on your browser. Please notify your lecturer!"
      );
    }

    geo.getCurrentPosition(
      async (pos) => {
        console.log(pos);
        setValues({
          ...values,
          longitude: pos.coords.longitude,
          latitude: pos.coords.latitude,
        });

        myLatLon = L.latLng(pos.coords.latitude, pos.coords.longitude);
        map.flyTo(myLatLon, 17);

        if (locationMarker) {
          map.removeLayer(locationMarker);
        }

        locationMarker = L.circle(myLatLon, {
          color: "blue",
          fillColor: "blue",
          fillOpacity: 0.3,
          radius: 4,
        }).addTo(map);
      },
      () => {
        console.log("Unable to fetch location!");
        setError(
          "Could not fetch location. Please refresh the page and make sure you click allow on the location services popup. If this proceeds please notify your lecturer!"
        );
      }
    );
  }, [map]);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      {
        const { data } = await onSignIn(values);
        setError("");
        setSubmitted(true);
        setSuccess(data.message);
      }
    } catch (err) {
      console.error(err.response.data.errors[0].msg);
      setError(err.response.data.errors[0].msg);
      setSuccess("");
    }
  };

  return loading ? (
    <div className="container">
      <h1>Loading...</h1>
    </div>
  ) : (
    <div className="container">
      <NavLink to={"/"} className="remove-decoration">
        <h1 className="text-center anseo-page-title mt-1">Anseo!</h1>
      </NavLink>
      <div className="card">
        <div className="card-body background-light-grey">
          <MapContainer center={center} zoom={17} ref={setMap}>
            <TileLayer
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <Polygon pathOptions={redOptions} positions={tudPolygon} />
          </MapContainer>
        </div>
      </div>
      <div
        className="card mb-3 m-auto mt-3 background-light-grey"
        style={{ maxWidth: "540px" }}
      >
        <div class="row g-0">
          <div class="col-md-12">
            <div className="card-body background-light-grey">
              <h2 className="card-title text-center text-secondary mt-1 mb-3">
                Sign Into: {session}
              </h2>
              {submitted ? (
                <h4 className="text-center text-success mt-2">
                  Thanks {values.name}! You have signed in successfully.
                </h4>
              ) : (
                <form onSubmit={(e) => onSubmit(e)} className="container">
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
                  <button
                    type="submit"
                    className="btn btn-secondary"
                    id="signin-btn"
                  >
                    Sign In
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
