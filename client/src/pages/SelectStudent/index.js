import React, { useState } from "react";
import {
  fetchSessionsForStudent,
  fetchModulesForStudent,
} from "../../api/lecturer.api";
import Layout from "../../components/Layout";
import ModuleList from "../../components/ModuleList";
import SessionList from "../../components/SessionList";

const SelectStudent = ({ id }) => {
  const [number, setNumber] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [sessions, setSessions] = useState([]);
  const [modules, setModules] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("No sessions available");
  const [message2, setMessage2] = useState("No modules available");

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const content = await fetchSessionsForStudent(number);
      setSessions(content.data.sessions);

      const content2 = await fetchModulesForStudent(number, id);
      setModules(content2.data.modules);

      setStudentNumber(number);
      setMessage("");
      setMessage2("");
    } catch (err) {
      console.error(err.response.data.errors[0].msg);
      setError(err.response.data.errors[0].msg);
      setModules([]);
      setStudentNumber("");
      setSessions([]);
      setMessage("No sessions available");
      setMessage2("No modules available");
    }
  };

  return (
    <Layout>
      <h1 className="text-center mt-5">Search Student</h1>
      <form className="d-flex mt-5" onSubmit={onSubmitForm}>
        <input
          type="text"
          className="form-control"
          required
          value={number.toUpperCase()}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Student number"
        />
        <button className="btn btn-success">Search</button>
      </form>
      <div style={{ color: "red", margin: "10px 0" }}>{error}</div>
      <div className="card w-75 m-auto mt-5">
        <div className="card-body">
          <h4 className="text-center mt-1">Modules</h4>
          <ModuleList modules={modules} studentNumber={studentNumber} />
          <p className="text-center mt-1">{message2}</p>
        </div>
      </div>
      <div className="card mt-5">
        <div className="card-body">
          <h4 className="text-center mt-1">Student Sessions</h4>
          <SessionList sessions={sessions} />
          <p className="text-center mt-1">{message}</p>
        </div>
      </div>
    </Layout>
  );
};

export default SelectStudent;
