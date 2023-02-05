import React, { useState } from "react";
import { fetchSessionsForStudent } from "../api/lecturer.api";
import Layout from "../components/layout";

const Search = () => {
  const [number, setNumber] = useState("");
  const [sessions, setSessions] = useState([]);
  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const content = await fetchSessionsForStudent(number);
      setSessions(content.data.sessions);
      setNumber("")
    } catch (err) {
      console.error(err.message);
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
          value={number}
          onChange={(e) => {
            setNumber(e.target.value);
          }}
        />
        <button className="btn btn-success">Search</button>
      </form>
    </Layout>
  );
};

export default Search;
