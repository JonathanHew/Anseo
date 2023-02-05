import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchProtectedInfo, onLogout } from "../api/auth";
import Layout from "../components/layout";
import { unauthenticateUser } from "../redux/slices/authSlice";
import { NavLink } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [protectedData, setProtectedData] = useState(null);
  
  const logout = async () => {
    try {
      await onLogout();

      dispatch(unauthenticateUser());
      localStorage.removeItem("isAuth");
    } catch (err) {
      console.error(err.response);
    }
  };

  const protectedInfo = async () => {
    try {
      const { data } = await fetchProtectedInfo();

      setProtectedData(data.info);

      setLoading(false);
    } catch (error) {
      logout();
    }
  };

  useEffect(() => {
    protectedInfo();
  }, []);

  return loading ? (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  ) : (
    <div>
      <Layout>
        <h1>Dashboard</h1>
        <h2>{protectedData}</h2>
        <label>Your sessions:</label>
        <NavLink to="/sessions" className="mx-3">
          <span>Sessions</span>
        </NavLink>
        <br></br>
        <label>Search for a student:</label>
        <NavLink to="/search" className="mx-3">
          <span>Search</span>
        </NavLink>
       </Layout>
    </div>
  );
};

export default Dashboard;
