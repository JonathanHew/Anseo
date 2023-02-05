import React, { useState } from "react";
import Layout from "../components/layout";

const Search = () => {
  const onSubmitForm = async (e) => {
    e.preventDefault();
    console.log("Form Submitted!!!");
  };

  return (
    <Layout>
      <h1 className="text-center mt-5">Search Student</h1>
      <form className="d-flex mt-5" onSubmit={onSubmitForm}>
        <input
          type="text"
          className="form-control"
          //value={description}
          //onChange={(e) => setDescription(e.target.value)}
        />
        <button className="btn btn-success">Search</button>
      </form>
    </Layout>
  );
};

export default Search;
