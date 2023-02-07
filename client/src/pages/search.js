import React, { useState } from "react";
import { fetchSessionsForStudent } from "../api/lecturer.api";
import Layout from "../components/layout";
import SessionList from "../components/sessionList";

const Search = () => {
  const [number, setNumber] = useState("");
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("No sessions available");
  const onSubmitForm = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const content = await fetchSessionsForStudent(number);
      setSessions(content.data.sessions);
      setNumber("");
      setMessage("");
    } catch (err) {
      console.error(err.response.data.errors[0].msg);
      setError(err.response.data.errors[0].msg);
      setSessions([]);
      setMessage("No sessions available")
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
      <SessionList sessions={sessions} />
      <p className="text-center mt-1">{message}</p>
    </Layout>
  );
};

export default Search;
