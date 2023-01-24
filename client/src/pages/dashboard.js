import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchProtectedInfo, onLogout } from "../api/auth";
import Layout from "../components/layout";
import { unauthenticateUser } from "../redux/slices/authSlice";
import { NavLink } from "react-router-dom";
import AddListForm from "../components/AddListForm";
import { Button, Modal } from "react-bootstrap";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [protectedData, setProtectedData] = useState(null);
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

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
        <label>Your Attendance List:</label>
        <NavLink to="/display" className="mx-3">
          <span>view</span>
        </NavLink>
        <br></br>
        <Button className="OpenListModal" onClick={handleShow}>
          Create List
        </Button>
        
        <Modal show={show}>
          <Modal.Header>
            <Modal.Title>Create New List</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddListForm/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Layout>
    </div>
  );
};

export default Dashboard;
